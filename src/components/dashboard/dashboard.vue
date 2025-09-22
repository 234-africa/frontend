<template>
  <div class="container py-4">
    <h2 class="mb-4 text-center">Dashboard Overview</h2>

    <!-- Metrics Row -->
    <div class="row g-3">
      <div class="col-md-4">
        <div class="p-3 border rounded text-center bg-light">
          {{ getProductsByUser.length }}

          <p class="mb-1 fw-bold">Total Events</p>
        </div>
      </div>

      <div class="col-md-4">
        <div class="p-3 border rounded text-center bg-light">
          {{ totalPrice }}
          <p class="mb-1 fw-bold">Total Revenue</p>
        </div>
      </div>

      <div class="col-md-4">
        <div class="p-3 border rounded text-center bg-light">
          {{ orders.length }}
          <p class="mb-1 fw-bold">Total Orders</p>
        </div>
      </div>
    </div>
    <div class="container-flui">
      <div>
        <div class="filter pt-2 row align-items-center">
          <div class="col-auto">
            <input
              type="text"
              class="form-control"
              v-model="searchQuery"
              placeholder="Search by Order ID"
            />
          </div>
        </div>
        <div class="text-center bg-success text-white p-2">
          <h5 class="mb-0">My orders</h5>
        </div>
        <div class="card-body p-0">
          <div class="table-container">
            <table class="table table-striped mb-0">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Date</th>
                  <th>reference</th>
                  <th>name of event</th>
                  <th>Customer Name</th>
                  <th>Phone number</th>
                  <th>Amount</th>

                  <th>Ticket type</th>
                  <th><button @click="downloadAndSendOrders">download</button></th>
                </tr>
              </thead>
              <tbody class="">
                <tr v-for="order in filteredOrders" :key="order._id">
                  <td>{{ order._id }}</td>
                  <td>{{ new Date(order.createdAt).toLocaleString() }}</td>

                  <td class="tes">{{ order.reference }}</td>
                  <td>{{ order.title }}</td>
                  <td>{{ order.contact?.email || "N/A" }}</td>
                  <td>{{ order.contact?.phone || "N/A" }}</td>
                  <td>₦{{ order.price }}</td>
                  <td>
                    <div v-for="ticket in order.tickets" :key="ticket._id">
                      {{ ticket.name }} x {{ ticket.quantity }}
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="pagination">
            <button
              class="pagination-btn"
              :disabled="currentPage === 1"
              @click="prevPage"
            >
              Previous
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
              Next
            </button>
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
<<<<<<< HEAD
          "https://event-ticket-backend-yx81.onrender.com/api/orders/download-and-email",
=======
          "https://event-ticket-qa70.onrender.com/api/orders/download-and-email",
>>>>>>> 24f4f118 (m)
          {
            headers: { Authorization: `Bearer ${this.getToken}` },
          }
        );

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
<<<<<<< HEAD
      .get("https://event-ticket-backend-yx81.onrender.com/api/orders", {
=======
      .get("https://event-ticket-qa70.onrender.com/api/orders", {
>>>>>>> 24f4f118 (m)
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

<style>
.tes {
  text-transform: none !important;
}
.custom-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
}

.custom-table th,
.custom-table td {
  padding: 10px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

.custom-table th {
  background-color: #f5f5f5;
}

.custom-table td button {
  padding: 5px 10px;
  font-size: 14px;
  border-radius: 4px;
}

.custom-table td .dropdown-menu {
  margin-top: 5px;
}

.custom-table td .dropdown-menu button {
  width: 100%;
  text-align: left;
}
.pagination {
  display: flex;
  justify-content: center;
  margin-top: 10px;
}

.pagination button {
  border: 1px solid #ccc;
  background-color: #fff;
  color: #000;
  padding: 5px 10px;
  margin: 0 5px;
  cursor: pointer;
}

.pagination button.active {
  background-color: #f4a213;
  color: #fff;
}

.filter {
  margin-bottom: 10px;
}

.filter label {
  margin-right: 5px;
}
.table-container {
  overflow-x: auto;
}

.scrollable-tbody {
  display: block;
  white-space: nowrap;
}
</style>
