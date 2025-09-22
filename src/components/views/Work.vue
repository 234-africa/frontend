<template>
  <div class="staff-login">
    <h2>Staff Login</h2>
    <form @submit.prevent="loginStaff">
      <div>
        <label>Name</label>
        <input
          v-model="name"
          type="text"
          required
          placeholder="Enter staff name"
        />
      </div>
      <div>
        <label>Passcode</label>
        <input
          v-model="passcode"
          type="password"
          required
          placeholder="Enter passcode"
        />
      </div>
      <button type="submit">Login</button>
    </form>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      name: "",
      passcode: "",
    };
  },
  methods: {
    async loginStaff() {
      try {

        const res = await axios.post(
          "https://event-ticket-qa70.onrender.com/api/staff/login",
          { name: this.name, passcode: this.passcode },
        );

        if (res.data.success) {
          localStorage.setItem("staffToken", res.data.token);
          alert("Staff login successful!");
          this.$router.push("/scanner");
        } else {
          alert(res.data.message);
        }
      } catch (err) {
        alert(err.response?.data?.message || "Login failed");
      }
    },
  },
};
</script>
