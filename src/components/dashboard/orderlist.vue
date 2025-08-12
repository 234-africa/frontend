<template>
  <div class="content-ody">
    <!-- row -->
    <div class="container-flui">
      <div class="form-head d-flex mb-3 align-items-start">
        <div class="mr-auto d-none d-lg-block">
          <h2 class="text-black font-w600 mb-0">Orders</h2>
          <p class="mb-0">Here is your order list data</p>
       
        </div>
      </div>
      <div>
        <div class="filter row align-items-center">
          <div class="col-auto">
            <input
              type="text"
              class="form-control"
              v-model="searchQuery"
              placeholder="Search by Order ID"
            />
          </div>
        </div>

        <div class="table-container">
          <table class="custom-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Date</th>
                <th>name of event</th>
                <th>Customer Name</th>
                <th>Phone number</th>
                <th>Amount</th>

                <th>Ticket type</th>
              </tr>
            </thead>
            <tbody class="">
              <tr v-for="(order, index) in orders" :key="order._id">
                <td>{{ order._id }}</td>
                <td>{{ new Date(order.createdAt).toLocaleString() }}</td>
                <td>{{ order.title }}</td>
                <td>{{ order.contact?.email || "N/A" }}</td>
                <td>{{ order.contact?.phone || "N/A" }}</td>
                <td>${{ order.price }}</td>
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
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import axios from "axios";
export default {
  data() {
    return {
      selectedStatus: "", // Selected filter status
      searchQuery: "", // Search query
      currentPage: 1, // Current page number
      rowsPerPage: 10, // Number of rows per page
      orders: [],
      totalPrice: 0,
    };
  },
  computed: {
    ...mapGetters(["getToken"]),
  },
  mounted() {
    axios
      .get("https://event-ticket-qa70.onrender.com/api/orders", {
        headers: {
          Authorization: `Bearer ${this.getToken}`,
        },
      })
      .then((response) => {
        this.orders = response.data.orders;
        // const total = this.orders.reduce((sum, order) => sum + order.price, 0);
        // this.totalPrice = total;

        console.log("Orders", this.orders);
        //  console.log("Total price:", this.totalPrice);
      })
      .catch((error) => {
        console.error("Error fetching orders:", error.response?.data || error);
      });
  },
  methods: {
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
};
</script>

<style>
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
