<template>
  <div class="card shadow-sm">
    <div class="text-center bg-success p-2 text-white">
      <h5 class="mb-0">Users</h5>
    </div>

    <!-- 🔍 Search Input -->
    <div class="p-2">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search by name, email, or ID"
        class="form-control w-50"
      />
    </div>

    <!-- 💰 Payout Modal -->
    <div v-if="showPayModal" class="modal" @click.self="showPayModal = false">
      <div class="modal-content">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h5 class="m-0 fw-bold">Make Payout</h5>
          <button class="btn btn-sm btn-light" @click="showPayModal = false">
            <i class="bi bi-x-lg"></i>
          </button>
        </div>

        <form @submit.prevent="makePayout(selectedUserId, payoutAmounts[selectedUserId])">
          <div class="mb-3">
            <label class="form-label">Amount (₦)</label>
            <input
              type="number"
              v-model.number="payoutAmounts[selectedUserId]"
              placeholder="Enter amount"
              class="form-control"
              min="1"
              required
            />
          </div>
          <button type="submit" class="btn btn-success w-100">Pay</button>
        </form>
      </div>
    </div>

    <!-- 📊 Users Table -->
    <div class="card-body p-0">
      <div class="table-container">
        <table class="table table-striped mb-0 custom-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Total Earnings</th>
              <th>Order Count</th>
              <th>Total Paid Out</th>
              <th>Unpaid Earnings</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in filteredUsers" :key="user._id">
              <td>{{ user._id }}</td>
              <td>{{ user.name }}</td>
              <td>{{ user.email }}</td>
              <td>₦{{ user.totalEarnings }}</td>
              <td>{{ user.orderCount }}</td>
              <td>₦{{ user.totalPaidOut }}</td>
              <td>₦{{ user.unpaidEarnings }}</td>
              <td>
                <button @click="goToEditUser(user._id)" class="btn btn-sm btn-primary">
                  Update
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      users: [],
      searchQuery: "",
      showPayModal: false,
      payoutAmounts: {},
      selectedUserId: null, // ✅ Added
    };
  },
  mounted() {
    this.fetchUsers();
  },
  methods: {
    async fetchUsers() {
      try {
        const res = await axios.get(
          "https://event-ticket-backend-yx81.onrender.com/api/users"
        );
        this.users = res.data.users;
        console.log(this.users);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    },
    async makePayout(userId, amount) {
      try {
        const res = await axios.post(
          `https://event-ticket-backend-yx81.onrender.com/api/users/${userId}/payout`,
          {
            amount,
          }
        );

        if (res.data.success) {
          alert(`✅ ${res.data.message}`);
          this.payoutAmounts[userId] = "";
          this.showPayModal = false;
          await this.fetchUsers();
        }
      } catch (error) {
        // only triggered for 4xx/5xx
        alert(error.response?.data?.message);
      }
    },
    goToEditUser(userId) {
      this.selectedUserId = userId;
      this.showPayModal = true;
    },
  },
  computed: {
    filteredUsers() {
      if (!this.searchQuery) return this.users;

      const query = this.searchQuery.toLowerCase();

      return this.users.filter((user) => {
        return (
          user.name.toLowerCase().includes(query) ||
          user.email.toLowerCase().includes(query) ||
          user._id.toLowerCase().includes(query)
        );
      });
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

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1050;
  padding: 1rem;
  box-sizing: border-box;
}

.modal-content {
  background: #fff;
  padding: 1.5rem;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  animation: fadeIn 0.3s ease-in-out;
  width: 100%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
  box-sizing: border-box;
}

/* Mobile adjustments */
@media (max-width: 576px) {
  .modal-content {
    padding: 1rem;
    border-radius: 8px;
    height: 100vh;
    max-height: 100vh;
    width: 100%;
  }
}

/* Optional fade-in animation */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
