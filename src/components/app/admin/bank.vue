<template>
  <div class="card shadow-sm p-0 mt-4">
    <!-- 💚 Header -->
    <div class="text-center bg-success text-white py-2">
      <h5 class="mb-0">Banks</h5>
    </div>

    <!-- 🔍 Search Input -->
    <div class="p-3">
      <input
        v-model="searchQuery"
        type="text"
        class="form-control w-50"
        placeholder="Search by Account Name, Account Number or Bank Name"
      />
    </div>

    <!-- 📋 Banks Table -->
    <div class="table-responsive">
      <table class="table table-striped custom-table mb-0" v-if="filteredBanks.length">
        <thead class="text-uppercase small text-muted">
          <tr>
            <th>Bank Account Name</th>
            <th>Account Number</th>
            <th>Bank Name</th>
            <th>User</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="bank in filteredBanks" :key="bank._id">
            <td>{{ bank.accountName }}</td>
            <td>{{ bank.accountNumber }}</td>
            <td>{{ bank.bankName }}</td>
            <td>{{ bank.user }}</td>
          </tr>
        </tbody>
      </table>

      <!-- ❌ No Results -->
      <div v-else class="text-center text-muted p-3">No matching banks found.</div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { mapGetters } from "vuex";

export default {
  name: "BankManager",
  data() {
    return {
      banks: [],
      searchQuery: "",
    };
  },
  computed: {
    ...mapGetters(["getToken"]),
    filteredBanks() {
      const query = this.searchQuery.trim().toLowerCase();
      if (!query) return this.banks;

      return this.banks.filter((bank) => {
        return (
          bank.accountName?.toLowerCase().includes(query) ||
          bank.accountNumber?.toLowerCase().includes(query) ||
          bank.bankName?.toLowerCase().includes(query) ||
          bank.user?.toLowerCase().includes(query)
        );
      });
    },
  },
  mounted() {
    this.fetchBanks();
  },
  methods: {
    async fetchBanks() {
      try {
        const res = await axios.get(
          "https://event-ticket-backend-yx81.onrender.com  /api/all-banks"
        );
        this.banks = res.data.banks;
      } catch (err) {
        console.error("Error fetching banks:", err);
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
</style>
