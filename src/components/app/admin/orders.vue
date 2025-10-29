<template>
  <div class="card shadow-sm p-0">
    <!-- 💚 Header -->
    <div class="text-center bg-success text-white py-2">
      <h5 class="mb-0">Orders</h5>
    </div>

    <!-- 🔍 Search & Filter -->
    <div class="p-3">
      <div class="row">
        <div class="col-md-4 mb-2">
          <input
            v-model="searchQuery"
            type="text"
            class="form-control"
            placeholder="Search by Email or Reference"
          />
        </div>
        <div class="col-md-4 mb-2">
          <select v-model="selectedEvent" class="form-control">
            <option value="">All Events</option>
            <option v-for="event in uniqueEvents" :key="event" :value="event">
              {{ event }}
            </option>
          </select>
        </div>
        <div class="col-md-4 mb-2">
          <button class="btn btn-success w-100" @click="exportToExcel">
            <i class="bi bi-download me-2"></i>Export to Excel
          </button>
        </div>
      </div>
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
            <td>{{ formatPrice(order.price) }}</td>
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
import * as XLSX from "xlsx";

export default {
  name: "Orders",
  data() {
    return {
      orders: [],
      selectedStatus: "",
      selectedEvent: "",
      searchQuery: "",
      loading: true,
      error: null,
    };
  },
  computed: {
    uniqueEvents() {
      const events = [...new Set(this.orders.map(order => order.title).filter(Boolean))];
      return events.sort();
    },
    filteredOrders() {
      let filtered = this.orders.filter((order) => {
        const statusMatch = !this.selectedStatus || order.status === this.selectedStatus;

        const query = this.searchQuery.trim().toLowerCase();
        const referenceMatch = order.reference?.toLowerCase().includes(query);
        const emailMatch = order.contact?.email?.toLowerCase().includes(query);

        const searchMatch = !query || referenceMatch || emailMatch;
        
        const eventMatch = !this.selectedEvent || order.title === this.selectedEvent;

        return statusMatch && searchMatch && eventMatch;
      });
      
      return filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    },
  },
  mounted() {
    this.fetchOrders();
  },
  methods: {
    async fetchOrders() {
      try {
        const response = await axios.get(
          "https://event-ticket-backend-yx81.onrender.com/api/all-orders"
        );
        this.orders = response.data.orders;
      } catch (err) {
        this.error = "Failed to fetch orders";
        console.error(err);
      } finally {
        this.loading = false;
      }
    },
    exportToExcel() {
      const exportData = this.filteredOrders.map(order => ({
        'Order ID': order._id,
        'Reference': order.reference,
        'Date': new Date(order.createdAt).toLocaleString(),
        'Event Name': order.title,
        'Customer Email': order.contact?.email || 'N/A',
        'Phone Number': order.contact?.phone || 'N/A',
        'Amount': this.formatPrice(order.price),
        'Ticket Types': order.tickets?.map(t => `${t.name} x${t.quantity}`).join(', ') || 'N/A'
      }));

      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Orders");
      
      const fileName = `orders_${new Date().toISOString().split('T')[0]}.xlsx`;
      XLSX.writeFile(workbook, fileName);
    },
    formatPrice(price) {
      return this.$store.getters.formatPrice(price);
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
  overflow-x: hidden;
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

<style scoped>
.card {
  border-radius: 6px;
  overflow: hidden;
}

.table-responsive {
  overflow-x: hidden;
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
