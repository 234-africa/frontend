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
              <h3 class="stats-number">{{ revenueDisplay }}</h3>
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
              <div class="d-flex gap-2">
                <button class="btn btn-success btn-download" @click="downloadAndSendOrders">
                  <i class="bi bi-file-pdf"></i> Email PDF
                </button>
                <button class="btn btn-primary btn-download" @click="downloadAndSendOrdersExcel">
                  <i class="bi bi-file-excel"></i> Email Excel
                </button>
              </div>
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
                    <td class="amount">{{ formatPrice(order.price, order.currency) }}</td>
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
import { formatPrice, getCurrencySymbol } from "@/helpers/currency";

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
    totalRevenueByCurrency() {
      const revenueByCurrency = {};
      this.orders.forEach((order) => {
        const currency = order.currency || "NGN";
        if (!revenueByCurrency[currency]) {
          revenueByCurrency[currency] = 0;
        }
        revenueByCurrency[currency] += order.price || 0;
      });
      return revenueByCurrency;
    },
    totalRevenueCurrency() {
      const currencies = Object.keys(this.totalRevenueByCurrency);
      return currencies.length === 1 ? currencies[0] : null;
    },
    revenueDisplay() {
      if (this.totalRevenueCurrency) {
        // Single currency - show total
        const total = this.totalRevenueByCurrency[this.totalRevenueCurrency];
        return formatPrice(total, this.totalRevenueCurrency);
      } else {
        // Multiple currencies - show breakdown
        return Object.entries(this.totalRevenueByCurrency)
          .map(([currency, amount]) => formatPrice(amount, currency))
          .join(" · ");
      }
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
    formatPrice,
    getCurrencySymbol,
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
    async downloadAndSendOrdersExcel() {
      try {
        const response = await axios.get(
          "https://event-ticket-backend-yx81.onrender.com/api/orders/download-and-email-excel",
          {
            headers: { Authorization: `Bearer ${this.getToken}` },
          }
        );
        console.log(response.data);
        if (response.data.success) {
          this.$swal({
            icon: 'success',
            title: 'Success!',
            text: 'Orders Excel sent to your email!',
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
          text: 'Failed to send Excel orders.',
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
@import './dashboard-modern.css';
</style>
