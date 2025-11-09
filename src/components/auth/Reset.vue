<template>
  <div class="reset-password-wrapper">
    <div class="reset-password-container">
      <div class="reset-password-card">
        <h4 class="reset-password-title">Update Password</h4>
        <p class="reset-password-subtitle">Enter your new password below</p>
        
        <form @submit.prevent="handleSubmit">
          <div class="form-group">
            <label class="form-label">New Password</label>
            <input
              class="form-input"
              type="password"
              v-model="password"
              placeholder="Enter new password"
              required
            />
          </div>
          
          <div class="form-submit">
            <button type="submit" class="btn-primary">Update Password</button>
          </div>
        </form>

        <p class="text-center mt-3">
          Remember your password?
          <router-link to="/login" class="link-blue">Back to Login</router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import Swal from "sweetalert2";
export default {
  data() {
    return {
      password: "",
      message: "",
    };
  },
  mounted() {
    //  console.log(this.$route.query.token);
  },
  methods: {
    async handleSubmit() {
      const response = await axios
        .post("https://event-ticket-backend-yx81.onrender.com/api/auth/updatePassword", {
          password: this.password,
          token: this.$route.query.token,
        })
        .then((response) => {
          this.message = response.data.message;
          Swal.fire(response.data.message);
        })
        .catch((err) => console.log(err));
      console.log(response);
    },
    clear() {
      this.$refs.form.reset();
    },
  },
};
</script>

<style scoped>
.reset-password-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 3rem 1rem;
}

.reset-password-container {
  max-width: 450px;
  width: 100%;
}

.reset-password-card {
  background: white;
  border-radius: 20px;
  padding: 3rem 2.5rem;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.reset-password-card:hover {
  box-shadow: 0 15px 50px rgba(0, 0, 0, 0.15);
  transform: translateY(-5px);
}

.reset-password-title {
  text-align: center;
  margin-bottom: 1rem;
  font-weight: 700;
  font-size: 2rem;
  color: #2c3e50;
}

.reset-password-subtitle {
  text-align: center;
  color: #6c757d;
  margin-bottom: 2rem;
  font-size: 0.95rem;
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

.form-input {
  width: 100%;
  padding: 1rem 1.25rem;
  border: 2px solid #e9ecef;
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: #f8f9fa;
}

.form-input:focus {
  outline: none;
  border-color: #f4a213;
  box-shadow: 0 0 0 0.2rem rgba(244, 162, 19, 0.15);
  background: white;
}

.form-submit {
  margin-top: 2rem;
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
  text-transform: capitalize;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(244, 162, 19, 0.3);
}

.text-center {
  text-align: center;
}

.mt-3 {
  margin-top: 1.5rem;
}

.link-blue {
  color: #f4a213;
  font-weight: 600;
  text-decoration: none;
  margin-left: 5px;
  transition: color 0.3s ease;
}

.link-blue:hover {
  color: #047143;
  text-decoration: underline;
}

@media (max-width: 576px) {
  .reset-password-card {
    padding: 2rem 1.5rem;
  }

  .reset-password-title {
    font-size: 1.6rem;
  }
}
</style>
