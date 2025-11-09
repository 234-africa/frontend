<template>
  <div class="login-wrapper">
    <div class="login-container">
      <div class="login-card">
        <h4 class="login-title">Welcome back</h4>

        <form @submit.prevent="loginUser">
          <div class="form-group">
            <label class="form-label">Email</label>
            <input
              v-model="email"
              type="email"
              class="form-input"
              placeholder="Email"
              required
            />
          </div>
          <div class="form-group">
            <label class="form-label">Password</label>
            <input
              v-model="password"
              type="password"
              class="form-input"
              placeholder="Password"
              required
            />
          </div>
          <div class="form-submit">
            <button type="submit" class="btn-primary">log in</button>
          </div>
        </form>
        <div class="auth-buttons pt-2 d-none">
          <button class="btn-google" @click="login">
            <span class="google-icon">G</span> Log in with Google
          </button>
        </div>
        <p class="text-center mt-1">
          <router-link to="/forgot-password" class="link-blue"
            >reset password</router-link
          >
        </p>
        <p class="text-start">
          dont have an account?
          <router-link to="/register" class="link-blue">Sign up</router-link>
        </p>
        <div class="text-center mt-1 d-flex">
          <small>login as staff member?</small>
          <router-link to="/staff-login" class="link-blue">Staff Login</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";
//import { googleSdkLoaded } from "vue3-google-login";
import Swal from "sweetalert2";
import jwt_decode from "jwt-decode";
import axios from "axios";

export default {
  data() {
    return {
      name: "",
      email: "",
      password: "",
    };
  },
  methods: {
    ...mapActions(["LOGIN_USER", "sendCodeToBackend"]),
    login() {
      googleSdkLoaded((google) => {
        google.accounts.oauth2
          .initCodeClient({
            client_id: process.env.VUE_APP_CLIENT_ID,
            scope: "email profile openid",
            redirect_uri:
              "https://event-ticket-backend-yx81.onrender.com/api/auth/callback",
            callback: (response) => {
              if (response.code) {
                this.sendCodeToBackend(response.code);
              }
            },
          })
          .requestCode();
      });
    },

    // login page
    loginUser() {
      const payload = {
        email: this.email,
        password: this.password,
      };

      this.LOGIN_USER(payload)
        .then(() => {
          Swal.fire("Login successful");
          window.location.href = "/dashboard";
        })
        .catch((err) => {
          const message = err.message || "Login failed";
          Swal.fire("Oh oo!", message, "error");
        });
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

.text-start {
  text-align: start;
}

.mt-1 {
  margin-top: 1rem;
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

.auth-buttons {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-top: 1.5rem;
}

.btn-google {
  width: 100%;
  padding: 1rem;
  border: 2px solid #e9ecef;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 600;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.75rem;
  background: white;
  color: #495057;
  transition: all 0.3s ease;
}

.btn-google:hover {
  border-color: #f4a213;
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.google-icon {
  background: linear-gradient(135deg, #fbbc05 0%, #f4a213 100%);
  color: white;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
}

.d-flex {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
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
