<template>
  <div class="dashboard-container">
    <div class="dashboard-header">
      <h2 class="dashboard-title">Dashboard Overview</h2>
    </div>

    <!-- Metrics Row -->
    <div class="metrics-grid">
      <div class="metric-card metric-events">
        <div class="metric-icon">📅</div>
        <div class="metric-content">
          <div class="metric-value">{{ getProductsByUser.length }}</div>
          <div class="metric-label">Total Events</div>
        </div>
      </div>

      <div class="metric-card metric-revenue">
        <div class="metric-icon">💰</div>
        <div class="metric-content">
          <div class="metric-value">₦{{ totalPrice.toLocaleString() }}</div>
          <div class="metric-label">Total Revenue</div>
        </div>
      </div>

      <div class="metric-card metric-orders">
        <div class="metric-icon">🎫</div>
        <div class="metric-content">
          <div class="metric-value">{{ orders.length }}</div>
          <div class="metric-label">Total Orders</div>
        </div>
      </div>
    </div>
    <div class="orders-section">
      <div class="orders-header">
        <h3 class="section-title">My Orders</h3>
        <div class="orders-actions">
          <input
            type="text"
            class="search-input"
            v-model="searchQuery"
            placeholder="🔍 Search by Order ID"
          />
          <button class="download-btn" @click="downloadAndSendOrders">
            📥 Download Orders
          </button>
        </div>
      </div>
      
      <div class="table-wrapper">
        <div class="table-container">
          <table class="modern-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Date</th>
                <th>Reference</th>
                <th>Event Name</th>
                <th>Customer Email</th>
                <th>Phone</th>
                <th>Amount</th>
                <th>Tickets</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="order in filteredOrders" :key="order._id" class="table-row">
                <td class="order-id">{{ order._id.substring(0, 8) }}...</td>
                <td>{{ new Date(order.createdAt).toLocaleDateString() }}</td>
                <td class="tes reference-cell">{{ order.reference }}</td>
                <td class="event-name">{{ order.title }}</td>
                <td>{{ order.contact?.email || "N/A" }}</td>
                <td>{{ order.contact?.phone || "N/A" }}</td>
                <td class="amount-cell">₦{{ order.price.toLocaleString() }}</td>
                <td class="tickets-cell">
                  <div v-for="ticket in order.tickets" :key="ticket._id" class="ticket-item">
                    {{ ticket.name }} x{{ ticket.quantity }}
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div class="pagination" v-if="totalPages > 1">
          <button
            class="pagination-btn"
            :disabled="currentPage === 1"
            @click="prevPage"
          >
            ‹ Prev
          </button>
          <button
            v-for="page in totalPages"
            :key="page"
            class="pagination-btn"
            :class="{ active: currentPage === page }"
            @click="changePage(page)"
          >
            {{ page }}
          </button>
          <button
            class="pagination-btn"
            :disabled="currentPage === totalPages"
            @click="nextPage"
          >
            Next ›
          </button>
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
      selectedStatus: "", // Selected filter status
      searchQuery: "", // Search query
      currentPage: 1, // Current page number
      rowsPerPage: 10, // Number of rows per page
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
          alert("✅ Orders sent to your email!");
        } else {
          alert("⚠️ " + response.data.message);
        }
      } catch (err) {
        console.error(err);
        alert("❌ Failed to send orders.");
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
      this.currentPage = 1; // Reset to the first page when applying filters
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
.dashboard-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
  background: #f8f9fa;
  min-height: 100vh;
}

.dashboard-header {
  margin-bottom: 2rem;
}

.dashboard-title {
  font-size: 2rem;
  font-weight: 700;
  color: #2c3e50;
  margin: 0;
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2.5rem;
}

.metric-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  display: flex;
  align-items: center;
  gap: 1.5rem;
  transition: all 0.3s ease;
  border-left: 4px solid;
}

.metric-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
}

.metric-events {
  border-color: #3498db;
}

.metric-revenue {
  border-color: #27ae60;
}

.metric-orders {
  border-color: #e74c3c;
}

.metric-icon {
  font-size: 3rem;
  opacity: 0.9;
}

.metric-content {
  flex: 1;
}

.metric-value {
  font-size: 1.75rem;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 0.25rem;
}

.metric-label {
  font-size: 0.95rem;
  color: #7f8c8d;
  font-weight: 500;
}

.orders-section {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

.orders-header {
  padding: 1.5rem;
  background: linear-gradient(135deg, #228B22 0%, #1a6b1a 100%);
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.section-title {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
}

.orders-actions {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.search-input {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 8px;
  font-size: 0.95rem;
  min-width: 250px;
  outline: none;
}

.download-btn {
  padding: 0.5rem 1.25rem;
  background: white;
  color: #228B22;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.download-btn:hover {
  background: #f0f0f0;
  transform: translateY(-2px);
}

.table-wrapper {
  padding: 1.5rem;
}

.table-container {
  overflow-x: auto;
  border-radius: 8px;
  border: 1px solid #e9ecef;
}

.modern-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.95rem;
}

.modern-table thead {
  background: #f8f9fa;
}

.modern-table th {
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  color: #495057;
  border-bottom: 2px solid #dee2e6;
  white-space: nowrap;
}

.modern-table tbody tr {
  border-bottom: 1px solid #e9ecef;
  transition: background-color 0.2s ease;
}

.modern-table tbody tr:hover {
  background-color: #f8f9fa;
}

.modern-table td {
  padding: 1rem;
  color: #495057;
}

.order-id {
  font-family: monospace;
  font-size: 0.85rem;
  color: #6c757d;
}

.reference-cell {
  font-weight: 600;
  color: #228B22;
}

.event-name {
  font-weight: 500;
  color: #2c3e50;
}

.amount-cell {
  font-weight: 600;
  color: #27ae60;
}

.tickets-cell {
  font-size: 0.9rem;
}

.ticket-item {
  padding: 0.25rem 0;
  color: #6c757d;
}

.tes {
  text-transform: none !important;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1.5rem;
  flex-wrap: wrap;
}

.pagination-btn {
  padding: 0.5rem 1rem;
  border: 1px solid #dee2e6;
  background: white;
  color: #495057;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 500;
  min-width: 40px;
}

.pagination-btn:hover:not(:disabled) {
  background: #228B22;
  color: white;
  border-color: #228B22;
}

.pagination-btn.active {
  background: #228B22;
  color: white;
  border-color: #228B22;
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .dashboard-container {
    padding: 1rem;
  }
  
  .orders-header {
    flex-direction: column;
    align-items: stretch;
  }
  
  .orders-actions {
    flex-direction: column;
  }
  
  .search-input {
    min-width: 100%;
  }
  
  .modern-table {
    font-size: 0.85rem;
  }
  
  .modern-table th,
  .modern-table td {
    padding: 0.75rem 0.5rem;
  }
}
</style>
