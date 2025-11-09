<template>
  <div class="confirm-email-wrapper">
    <div class="confirm-email-container">
      <div class="confirm-email-card">
        <!-- Loading State -->
        <div v-if="loading" class="state-content">
          <div class="loading-spinner"></div>
          <h4 class="state-title">Confirming Your Email</h4>
          <p class="state-subtitle">Please wait while we verify your email address...</p>
        </div>

        <!-- Success State -->
        <div v-else-if="successMessage" class="state-content">
          <div class="success-icon">
            <i class="bi bi-check-circle-fill"></i>
          </div>
          <h4 class="state-title">Email Confirmed!</h4>
          <p class="state-subtitle">{{ successMessage }}</p>
          <div class="action-buttons">
            <router-link to="/login" class="btn-primary">
              Go to Login
            </router-link>
          </div>
        </div>

        <!-- Error State -->
        <div v-else-if="errorMessage" class="state-content">
          <div class="error-icon">
            <i class="bi bi-x-circle-fill"></i>
          </div>
          <h4 class="state-title">Confirmation Failed</h4>
          <p class="state-subtitle">{{ errorMessage }}</p>
          <div class="action-buttons">
            <router-link to="/login" class="btn-primary">
              Back to Login
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
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
        `https://event-ticket-backend-yx81.onrender.com/api/auth/confirm/${token}`
      );
      this.successMessage = response.data.message || "Email confirmed successfully!";
    } catch (error) {
      this.errorMessage = error.response?.data?.message || "Failed to confirm email.";
    } finally {
      this.loading = false;
    }
  },
};
</script>

<style scoped>
.confirm-email-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 3rem 1rem;
}

.confirm-email-container {
  max-width: 500px;
  width: 100%;
}

.confirm-email-card {
  background: white;
  border-radius: 20px;
  padding: 3rem 2.5rem;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.confirm-email-card:hover {
  box-shadow: 0 15px 50px rgba(0, 0, 0, 0.15);
  transform: translateY(-5px);
}

.state-content {
  text-align: center;
}

.loading-spinner {
  width: 60px;
  height: 60px;
  border: 4px solid #e9ecef;
  border-top: 4px solid #f4a213;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 2rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.success-icon {
  font-size: 4rem;
  color: #047143;
  margin-bottom: 1.5rem;
}

.error-icon {
  font-size: 4rem;
  color: #dc3545;
  margin-bottom: 1.5rem;
}

.state-title {
  font-weight: 700;
  font-size: 2rem;
  color: #2c3e50;
  margin-bottom: 1rem;
}

.state-subtitle {
  color: #6c757d;
  margin-bottom: 2rem;
  font-size: 1rem;
  line-height: 1.6;
}

.action-buttons {
  margin-top: 2rem;
}

.btn-primary {
  display: inline-block;
  width: 100%;
  max-width: 250px;
  background: linear-gradient(135deg, #f4a213 0%, #047143 100%);
  color: white;
  padding: 1rem 2rem;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  font-size: 1.05rem;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  text-transform: capitalize;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(244, 162, 19, 0.3);
  color: white;
  text-decoration: none;
}

@media (max-width: 576px) {
  .confirm-email-card {
    padding: 2rem 1.5rem;
  }

  .state-title {
    font-size: 1.6rem;
  }

  .success-icon,
  .error-icon {
    font-size: 3rem;
  }
}
</style>
