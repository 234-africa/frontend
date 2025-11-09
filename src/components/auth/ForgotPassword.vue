<template>
  <div class="forgot-password-wrapper">
    <div class="forgot-password-container">
      <div class="forgot-password-card">
        <h4 class="forgot-password-title">Forgot Password</h4>
        <p class="forgot-password-subtitle">Enter your email address and we'll send you a reset link</p>
        
        <form @submit.prevent="handleSubmit">
          <div class="form-group">
            <label class="form-label">Email Address</label>
            <input
              type="email"
              class="form-input"
              placeholder="hello@example.com"
              v-model="email"
              required
            />
          </div>
          
          <div class="form-submit">
            <button type="submit" class="btn-primary">Submit</button>
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
      email: "",
      message: "",
    };
  },

  methods: {
    async handleSubmit() {
      const response = await axios
        .post("https://event-ticket-backend-yx81.onrender.com/api/auth/forgotPassword", {
          email: this.email,
        })
        .then((response) => {
          this.message = response.data.message;
          Swal.fire(response.data.message);
          console.log(this.message);
        })
        .catch((err) => console.log(err));
    },
    clear() {
      this.$refs.form.reset();
    },
  },
};
</script>

<style scoped>
.forgot-password-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 3rem 1rem;
}

.forgot-password-container {
  max-width: 450px;
  width: 100%;
}

.forgot-password-card {
  background: white;
  border-radius: 20px;
  padding: 3rem 2.5rem;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.forgot-password-card:hover {
  box-shadow: 0 15px 50px rgba(0, 0, 0, 0.15);
  transform: translateY(-5px);
}

.forgot-password-title {
  text-align: center;
  margin-bottom: 1rem;
  font-weight: 700;
  font-size: 2rem;
  color: #2c3e50;
}

.forgot-password-subtitle {
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
  .forgot-password-card {
    padding: 2rem 1.5rem;
  }

  .forgot-password-title {
    font-size: 1.6rem;
  }
}
</style>
