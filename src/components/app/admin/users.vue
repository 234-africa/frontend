<template>
  <div class="card shadow-sm">
    <div class="text-center bg-success p-2 text-white">
      <h5 class="mb-0">users</h5>
    </div>

    <!-- 🔍 Search Input -->
    <div class="p-2">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search by name or email"
        class="form-control w-50"
      />
    </div>

    <div class="card-body p-0">
      <table class="table table-striped mb-0">
        <thead>
          <tr>
            <th>id</th>
            <th>Name</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          <!-- 💡 Use filteredUsers instead of users -->
          <tr v-for="user in filteredUsers" :key="user._id">
            <td>{{ user._id }}</td>
            <td>{{ user.name }}</td>
            <td>{{ user.email }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      users: [], // Store all users
      searchQuery: "", // For the search input
    };
  },
  mounted() {
    this.fetchUsers();
  },
  methods: {
    async fetchUsers() {
      try {
        const res = await axios.get("https://event-ticket-qa70.onrender.com/api/users");
        this.users = res.data.users;
        console.log(this.users);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    },
  },
  computed: {
    filteredUsers() {
      if (!this.searchQuery) return this.users;

      const query = this.searchQuery.toLowerCase();

      return this.users.filter((user) => {
        return (
          user.name.toLowerCase().includes(query) ||
          user.email.toLowerCase().includes(query)
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
</style>
