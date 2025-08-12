<template>
  <div>
    <div class="filter row align-items-center">
      <div class="col-auto">
        <input
          type="text"
          class="form-control"
          v-model="searchQuery"
          placeholder="Search by Email or Reference"
        />
      </div>
    </div>

    <div class="table-container">
      <table class="custom-table">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Reference</th>
            <th>Date</th>
            <th>Name of event</th>
            <th>Customer Email</th>
            <th>Phone number</th>
            <th>Amount</th>
            <th>Ticket type</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="order in filteredOrders" :key="order._id">
            <td>{{ order._id }}</td>
            <td>{{ order.reference }}</td>
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
            <td>
              <button @click="deleteOrder(order._id)">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "Orders",
  data() {
    return {
      orders: [],
      selectedStatus: "",
      searchQuery: "",
      loading: true,
      error: null,
    };
  },
  mounted() {
    this.fetchOrders();
  },
  computed: {
    filteredOrders() {
      return this.orders.filter((order) => {
        // Filter by status if selected
        const statusMatch =
          !this.selectedStatus || order.status === this.selectedStatus;

        // Filter by search query in reference or email (case insensitive)
        const query = this.searchQuery.trim().toLowerCase();
        const referenceMatch = order.reference?.toLowerCase().includes(query);
        const emailMatch = order.contact?.email?.toLowerCase().includes(query);

        const searchMatch = !query || referenceMatch || emailMatch;

        return statusMatch && searchMatch;
      });
    },
  },
  methods: {
    
    async fetchOrders() {
      try {
        const response = await axios.get(
          "https://event-ticket-qa70.onrender.com/api/all-orders"
        );
        this.orders = response.data.orders;
      } catch (err) {
        this.error = "Failed to fetch orders";
        console.error(err);
      } finally {
        this.loading = false;
      }
    },
    async deleteOrder(orderId) {
      if (!confirm("Are you sure you want to delete this order?")) return;
      console.log(orderId)

      try {
        await axios.delete(`https://event-ticket-qa70.onrender.com/api/order/${orderId}`);
        alert("Order deleted successfully");
        this.fetchOrders(); // Refresh the list
      } catch (error) {
        console.error("Delete failed:", error);
        alert("Failed to delete order");
      }
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
