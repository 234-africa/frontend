<template>
  <div class="dashboard-modern">
    <div class="container-fluid px-4 py-4">
      <div class="dashboard-header mb-5">
        <h1 class="dashboard-title">
          <i class="bi bi-speedometer2"></i> Dashboard Overview
        </h1>
        <p class="dashboard-subtitle">Welcome back! Here's what's happening with your events</p>
      </div>

      <div class="row g-4 mb-5">
        <div class="col-lg-4 col-md-6 col-12">
          <div class="stats-card stats-card-primary">
            <div class="stats-card-icon">
              <i class="bi bi-calendar-event"></i>
            </div>
            <div class="stats-card-content">
              <h3 class="stats-number">{{ getProductsByUser.length }}</h3>
              <p class="stats-label">Total Events</p>
            </div>
          </div>
        </div>

        <div class="col-lg-4 col-md-6 col-12">
          <div class="stats-card stats-card-success">
            <div class="stats-card-icon">
              <i class="bi bi-currency-exchange"></i>
            </div>
            <div class="stats-card-content">
              <h3 class="stats-number">₦{{ totalPrice.toLocaleString() }}</h3>
              <p class="stats-label">Total Revenue</p>
            </div>
          </div>
        </div>

        <div class="col-lg-4 col-md-6 col-12">
          <div class="stats-card stats-card-info">
            <div class="stats-card-icon">
              <i class="bi bi-receipt"></i>
            </div>
            <div class="stats-card-content">
              <h3 class="stats-number">{{ orders.length }}</h3>
              <p class="stats-label">Total Orders</p>
            </div>
          </div>
        </div>
      </div>

      <div class="orders-section">
        <div class="card modern-card">
          <div class="card-header">
            <div class="d-flex justify-content-between align-items-center flex-wrap">
              <h4 class="card-title mb-0">
                <i class="bi bi-list-ul"></i> My Orders
              </h4>
              <button class="btn btn-success btn-download" @click="downloadAndSendOrders">
                <i class="bi bi-download"></i> Download Orders
              </button>
            </div>
          </div>
          <div class="card-body">
            <div class="search-box mb-4">
              <i class="bi bi-search search-icon"></i>
              <input
                type="text"
                class="form-control search-input"
                v-model="searchQuery"
                placeholder="Search by Order ID..."
              />
            </div>

            <div class="table-responsive">
              <table class="table modern-table">
                <thead>
                  <tr>
                    <th><i class="bi bi-hash"></i> Order ID</th>
                    <th><i class="bi bi-calendar3"></i> Date</th>
                    <th><i class="bi bi-bookmark"></i> Reference</th>
                    <th><i class="bi bi-ticket-perforated"></i> Event Name</th>
                    <th><i class="bi bi-envelope"></i> Customer</th>
                    <th><i class="bi bi-telephone"></i> Phone</th>
                    <th><i class="bi bi-cash-stack"></i> Amount</th>
                    <th><i class="bi bi-ticket-detailed"></i> Tickets</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="order in paginatedOrders" :key="order._id" class="table-row-hover">
                    <td class="order-id">{{ order._id }}</td>
                    <td class="order-date">{{ new Date(order.createdAt).toLocaleDateString() }}</td>
                    <td class="tes">{{ order.reference }}</td>
                    <td class="event-name">{{ order.title }}</td>
                    <td>{{ order.contact?.email || "N/A" }}</td>
                    <td>{{ order.contact?.phone || "N/A" }}</td>
                    <td class="amount">₦{{ order.price.toLocaleString() }}</td>
                    <td>
                      <div v-for="ticket in order.tickets" :key="ticket._id" class="ticket-badge">
                        {{ ticket.name }} x {{ ticket.quantity }}
                      </div>
                    </td>
                  </tr>
                  <tr v-if="filteredOrders.length === 0">
                    <td colspan="8" class="text-center py-5">
                      <i class="bi bi-inbox" style="font-size: 3rem; color: #ccc;"></i>
                      <p class="mt-3 text-muted">No orders found</p>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div class="pagination-modern" v-if="totalPages > 1">
              <button
                class="pagination-btn"
                :disabled="currentPage === 1"
                @click="prevPage"
              >
                <i class="bi bi-chevron-left"></i> Previous
              </button>
              <div class="page-numbers">
                <button
                  v-for="page in displayPages"
                  :key="page"
                  class="page-btn"
                  :class="{ active: currentPage === page }"
                  @click="changePage(page)"
                >
                  {{ page }}
                </button>
              </div>
              <button
                class="pagination-btn"
                :disabled="currentPage === totalPages"
                @click="nextPage"
              >
                Next <i class="bi bi-chevron-right"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import axios from "axios";

export default {
  components: {},
  data() {
    return {
      selectedStatus: "",
      searchQuery: "",
      currentPage: 1,
      rowsPerPage: 10,
      totalPrice: 0,
      orders: [],
    };
  },

  computed: {
    ...mapGetters(["getToken", "getProductsByUser"]),

    productsByUser() {
      return this.getProductsByUser;
    },
    filteredOrders() {
      if (!this.searchQuery) return this.orders;
      return this.orders.filter((order) =>
        order._id.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    },
    paginatedOrders() {
      const start = (this.currentPage - 1) * this.rowsPerPage;
      const end = start + this.rowsPerPage;
      return this.filteredOrders.slice(start, end);
    },
    totalPages() {
      return Math.ceil(this.filteredOrders.length / this.rowsPerPage);
    },
    displayPages() {
      const pages = [];
      const maxVisible = 5;
      let startPage = Math.max(1, this.currentPage - Math.floor(maxVisible / 2));
      let endPage = Math.min(this.totalPages, startPage + maxVisible - 1);

      if (endPage - startPage < maxVisible - 1) {
        startPage = Math.max(1, endPage - maxVisible + 1);
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
      return pages;
    },
  },
  methods: {
    async downloadAndSendOrders() {
      try {
        const response = await axios.get(
          "https://event-ticket-backend-yx81.onrender.com/api/orders/download-and-email",
          {
            headers: { Authorization: `Bearer ${this.getToken}` },
          }
        );
        console.log(response.data);
        if (response.data.success) {
          this.$swal({
            icon: 'success',
            title: 'Success!',
            text: 'Orders sent to your email!',
            confirmButtonColor: '#047143',
            iconColor: '#047143',
            showClass: {
              popup: 'animate__animated animate__fadeInDown'
            },
            hideClass: {
              popup: 'animate__animated animate__fadeOutUp'
            }
          });
        } else {
          this.$swal({
            icon: 'warning',
            title: 'Notice',
            text: response.data.message,
            confirmButtonColor: '#f4a213',
            iconColor: '#f4a213'
          });
        }
      } catch (err) {
        console.error(err);
        this.$swal({
          icon: 'error',
          title: 'Error',
          text: 'Failed to send orders.',
          confirmButtonColor: '#f4a213',
          iconColor: '#f4a213'
        });
      }
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    },
    changePage(page) {
      this.currentPage = page;
    },
    applyFilters() {
      this.currentPage = 1;
    },
  },

  mounted() {
    axios
      .get("https://event-ticket-backend-yx81.onrender.com/api/orders", {
        headers: {
          Authorization: `Bearer ${this.getToken}`,
        },
      })
      .then((response) => {
        this.orders = response.data.orders;
        console.log("Orders fetched:", this.orders);
        const total = this.orders.reduce((sum, order) => sum + order.price, 0);
        this.totalPrice = total;
        console.log("Total price:", this.totalPrice);
      })
      .catch((error) => {
        console.error("Error fetching orders:", error.response?.data || error);
      });

    this.$store.dispatch("fetchProductsByUser");
  },
};
</script>

<style scoped>
.dashboard-modern {
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  min-height: 100vh;
  padding-bottom: 2rem;
}

.dashboard-header {
  text-align: center;
  margin-top: 1rem;
}

.dashboard-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.dashboard-subtitle {
  font-size: 1.1rem;
  color: #6c757d;
  font-weight: 400;
}

.stats-card {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 1.5rem;
  border: 1px solid rgba(0, 0, 0, 0.05);
  height: 100%;
}

.stats-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.12);
}

.stats-card-icon {
  width: 70px;
  height: 70px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  flex-shrink: 0;
}

.stats-card-primary .stats-card-icon {
  background: linear-gradient(135deg, #f4a213 0%, #d68910 100%);
  color: white;
}

.stats-card-success .stats-card-icon {
  background: linear-gradient(135deg, #047143 0%, #035a36 100%);
  color: white;
}

.stats-card-info .stats-card-icon {
  background: linear-gradient(135deg, #f4a213 0%, #047143 100%);
  color: white;
}

.stats-card-content {
  flex: 1;
}

.stats-number {
  font-size: 2.2rem;
  font-weight: 700;
  color: #2c3e50;
  margin: 0;
  line-height: 1;
}

.stats-label {
  font-size: 0.95rem;
  color: #6c757d;
  margin: 0.5rem 0 0 0;
  font-weight: 500;
}

.orders-section {
  margin-top: 2rem;
}

.modern-card {
  background: white;
  border-radius: 20px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.modern-card .card-header {
  background: linear-gradient(135deg, #f4a213 0%, #047143 100%);
  padding: 1.5rem 2rem;
  border: none;
}

.modern-card .card-title {
  color: white;
  font-size: 1.5rem;
  font-weight: 600;
}

.modern-card .card-title i {
  margin-right: 0.5rem;
}

.btn-download {
  background: white !important;
  color: #f4a213 !important;
  border: none !important;
  padding: 0.6rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn-download:hover {
  transform: scale(1.05);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}

.btn-download i {
  margin-right: 0.5rem;
}

.search-box {
  position: relative;
  max-width: 400px;
}

.search-icon {
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: #6c757d;
  font-size: 1.1rem;
}

.search-input {
  padding-left: 45px;
  border-radius: 12px;
  border: 2px solid #e9ecef;
  height: 50px;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.search-input:focus {
  border-color: #f4a213;
  box-shadow: 0 0 0 0.2rem rgba(244, 162, 19, 0.15);
}

.modern-table {
  margin: 0;
}

.modern-table thead {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
}

.modern-table thead th {
  border: none;
  padding: 1.2rem 1rem;
  font-weight: 600;
  color: #495057;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.modern-table thead th i {
  margin-right: 0.5rem;
  color: #f4a213;
}

.modern-table tbody tr {
  border-bottom: 1px solid #f1f3f5;
  transition: all 0.2s ease;
}

.table-row-hover:hover {
  background-color: #f8f9fa;
  transform: scale(1.01);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.modern-table tbody td {
  padding: 1.2rem 1rem;
  vertical-align: middle;
  font-size: 0.95rem;
  color: #495057;
}

.order-id {
  font-family: 'Courier New', monospace;
  font-size: 0.85rem;
  color: #6c757d;
}

.order-date {
  color: #495057;
  font-weight: 500;
}

.tes {
  text-transform: none !important;
  font-family: 'Courier New', monospace;
  color: #f4a213;
  font-weight: 600;
}

.event-name {
  font-weight: 600;
  color: #2c3e50;
}

.amount {
  font-weight: 700;
  color: #047143;
  font-size: 1.05rem;
}

.ticket-badge {
  display: inline-block;
  background: linear-gradient(135deg, #f4a213 0%, #047143 100%);
  color: white;
  padding: 0.4rem 0.8rem;
  border-radius: 8px;
  margin: 0.2rem;
  font-size: 0.85rem;
  font-weight: 600;
}

.pagination-modern {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 2rem;
  padding: 1rem 0;
}

.pagination-btn {
  background: white;
  border: 2px solid #e9ecef;
  color: #495057;
  padding: 0.6rem 1.2rem;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.pagination-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #f4a213 0%, #047143 100%);
  color: white;
  border-color: #f4a213;
  transform: translateY(-2px);
}

.pagination-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.page-numbers {
  display: flex;
  gap: 0.5rem;
}

.page-btn {
  width: 45px;
  height: 45px;
  border-radius: 10px;
  border: 2px solid #e9ecef;
  background: white;
  color: #495057;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.page-btn:hover {
  border-color: #f4a213;
  color: #f4a213;
}

.page-btn.active {
  background: linear-gradient(135deg, #f4a213 0%, #047143 100%);
  color: white;
  border-color: #f4a213;
}

@media (max-width: 768px) {
  .dashboard-title {
    font-size: 1.8rem;
  }

  .stats-card {
    padding: 1.5rem;
  }

  .stats-number {
    font-size: 1.8rem;
  }

  .stats-card-icon {
    width: 60px;
    height: 60px;
    font-size: 1.5rem;
  }

  .modern-card .card-header {
    padding: 1rem;
  }

  .modern-card .card-title {
    font-size: 1.2rem;
  }

  .btn-download {
    width: 100%;
    margin-top: 1rem;
  }

  .pagination-modern {
    flex-direction: column;
    gap: 0.5rem;
  }

  .page-numbers {
    flex-wrap: wrap;
    justify-content: center;
  }
}

@media (max-width: 576px) {
  .modern-table {
    font-size: 0.85rem;
  }

  .modern-table thead th,
  .modern-table tbody td {
    padding: 0.8rem 0.5rem;
  }

  .stats-number {
    font-size: 1.5rem;
  }
}
</style>
