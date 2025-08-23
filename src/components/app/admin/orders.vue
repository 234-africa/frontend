<template>
  <div class="card shadow-sm p-0">
    <!-- 💚 Header -->
    <div class="text-center bg-success text-white py-2">
      <h5 class="mb-0">Orders</h5>
    </div>

    <!-- 🔍 Search Input -->
    <div class="p-3">
      <input
        v-model="searchQuery"
        type="text"
        class="form-control w-50"
        placeholder="Search by Email or Reference"
      />
    </div>

    <!-- 📋 Orders Table -->
    <div class="table-responsive">
      <table class="table table-striped custom-table mb-0" v-if="filteredOrders.length">
        <thead class="text-uppercase small text-muted">
          <tr>
            <th>Order ID</th>
            <th>Reference</th>
            <th>Date</th>
            <th>Name of event</th>
            <th>Customer Email</th>
            <th>Phone number</th>
            <th>Amount</th>
            <th>Ticket type</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="order in filteredOrders" :key="order._id">
            <td>{{ order._id }}</td>
            <td class="tes">{{ order.reference }}</td>
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

      <!-- ❌ No Results -->
      <div v-else class="text-center text-muted p-3">No matching orders found.</div>
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
  computed: {
    filteredOrders() {
      return this.orders.filter((order) => {
        const statusMatch = !this.selectedStatus || order.status === this.selectedStatus;

        const query = this.searchQuery.trim().toLowerCase();
        const referenceMatch = order.reference?.toLowerCase().includes(query);
        const emailMatch = order.contact?.email?.toLowerCase().includes(query);

        const searchMatch = !query || referenceMatch || emailMatch;

        return statusMatch && searchMatch;
      });
    },
  },
  mounted() {
    this.fetchOrders();
  },
  methods: {
    async fetchOrders() {
      try {
        const response = await axios.get("https://event-ticket-qa70.onrender.com/api/all-orders");
        this.orders = response.data.orders;
      } catch (err) {
        this.error = "Failed to fetch orders";
        console.error(err);
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
.card {
  border-radius: 6px;
  overflow: hidden;
}

.table-responsive {
  overflow-x: auto;
}

.custom-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
}

.custom-table thead {
  background-color: #f8f9fa;
}

.custom-table th,
.custom-table td {
  padding: 12px;
  vertical-align: middle;
}

.custom-table tr:nth-child(even) {
  background-color: #f9f9f9;
}

.custom-table tr:hover {
  background-color: #f1f1f1;
}

.tes {
  text-transform: none !important;
}
</style>
