<template>
  <div class="confirm-email"></div>
</template>

<script>
import axios from "axios";

export default {
  name: "ConfirmEmail",
  data() {
    return {
      successMessage: "",
      errorMessage: "",
      loading: true,
    };
  },
  async mounted() {
    const token = this.$route.query.token;

    if (!token) {
      this.errorMessage = "Missing confirmation token.";
      this.loading = false;
      return;
    }

    try {
      const response = await axios.get(
        `http://localhost:5000/api/auth/confirm/${token}`
      );
      this.successMessage = response.data.message || "Email confirmed successfully!";
      alert(this.successMessage);
    } catch (error) {
      this.errorMessage = error.response?.data?.message || "Failed to confirm email.";
      alert(this.errorMessage);
    } finally {
      this.loading = false;
    }
  },
};
</script>

<style scoped>
.success {
  color: green;
}
.error {
  color: red;
}
</style>
