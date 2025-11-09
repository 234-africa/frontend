<template>
  <div class="login-wrapper">
    <div class="login-container">
      <div class="login-card">
        <h4 class="login-title">Staff Login</h4>

        
    <form @submit.prevent="loginStaff">
          <div class="form-group">
            <label class="form-label">Enter Staff Name</label>
            <input
              v-model="name"
          type="text"
          class="form-control"
          required
          placeholder="Enter staff name"
            />
          </div>
          <div class="form-group">
            <label class="form-label">Enter Passcode</label>
            <input
              v-model="passcode"
          type="password"
          class="form-control"
          required
          placeholder="Enter passcode"
            />
          </div>
         
          <button type="submit" class="btn-primary">Log in</button>
        </form>
      </div>
    </div>
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
          "https://event-ticket-backend-yx81.onrender.com/api/staff/login",
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


<style scoped>
.login-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 3rem 1rem;
}

.login-container {
  max-width: 450px;
  width: 100%;
}

.login-card {
  background: white;
  border-radius: 20px;
  padding: 3rem 2.5rem;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.login-card:hover {
  box-shadow: 0 15px 50px rgba(0, 0, 0, 0.15);
  transform: translateY(-5px);
}

.login-title {
  text-align: center;
  margin-bottom: 2rem;
  font-weight: 700;
  font-size: 2rem;
  color: #2c3e50;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #495057;
  font-size: 0.95rem;
}

.form-control {
  width: 100%;
  padding: 1rem 1.25rem;
  border: 2px solid #e9ecef;
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: #f8f9fa;
}

.form-control:focus {
  outline: none;
  border-color: #f4a213;
  box-shadow: 0 0 0 0.2rem rgba(244, 162, 19, 0.15);
  background: white;
}

.btn-primary {
  width: 100%;
  background: linear-gradient(135deg, #f4a213 0%, #047143 100%);
  color: white;
  padding: 1rem;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  font-size: 1.05rem;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 1rem;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(244, 162, 19, 0.3);
}

@media (max-width: 576px) {
  .login-card {
    padding: 2rem 1.5rem;
  }

  .login-title {
    font-size: 1.6rem;
  }
}
</style>
