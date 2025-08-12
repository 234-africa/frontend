<template>
  <div class="login-wrapper">
    <div class="login-container">
      <div class="login-card">
        <h4 class="login-title">Welcome back</h4>

        <form @submit.prevent="loginUser">
          <div class="form-group">
            <input
              v-model="email"
              type="email"
              class="form-input"
              placeholder="Email"
              required
            />
          </div>
          <div class="form-group">
            <input
              v-model="password"
              type="password"
              class="form-input"
              placeholder="Password"
              required
            />
          </div>
          <div class="text-end">
            <router-link to="/forgot-password" class="link-muted">
              Forgot Password?
            </router-link>
          </div>
          <button type="submit" class="btn-primary">Log in</button>
        </form>

        <p class="text-center">
          Don't have an account?
          <router-link to="/register" class="link-teal"> Sign up </router-link>
        </p>

        <div class="auth-buttons">
          <button class="btn-dark" @click="loginWithApple">
            🍎 Log in with Apple
          </button>
          <button class="btn-google" @click="login">
            <span class="google-icon">G</span> Log in with Google
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import { googleSdkLoaded } from "vue3-google-login";
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
            client_id:
              "914476969936-ipf8ai34icgm2ob2der1u5b6bt4qca4s.apps.googleusercontent.com",
            scope: "email profile openid",
            redirect_uri: "https://event-ticket-qa70.onrender.com/auth/callback",
            callback: (response) => {
              if (response.code) {
                this.sendCodeToBackend(response.code);
              }
            },
          })
          .requestCode();
      });
    },
 
    
    loginUser() {
      const payload = {
        email: this.email,
        password: this.password,
      };

      this.LOGIN_USER(payload)
        .then((response) => {
          const decodedToken = jwt_decode(response.token);
          // console.log(decodedToken);
          // Access the decoded token properties
          const isAdmin = decodedToken.isAdmin;

          Swal.fire("login successful");

          // Redirect based on user role
          //console.log("isAdmin:", isAdmin);
          this.$router.push("/");
        })
        .catch((err) => {
          const message = err.message;

          Swal.fire("Oh oo!", `${message}`, "error");
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
  padding: 3rem 1rem;
}

.login-container {
  max-width: 400px;
  width: 100%;
}

.login-card {
  background-color: white;
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
}

.login-title {
  text-align: center;
  margin-bottom: 1.5rem;
  font-weight: bold;
}

.form-group {
  margin-bottom: 1rem;
}

.form-input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #ccc;
  border-radius: 50px;
  font-size: 1rem;
}

.text-end {
  text-align: right;
  margin-bottom: 1rem;
}

.link-muted {
  color: #777;
  text-decoration: none;
  font-size: 0.9rem;
}

.link-teal {
  color: teal;
  font-weight: bold;
  text-decoration: none;
}

.btn-primary {
  width: 100%;
  background-color: #f4a213;
  color: white;
  padding: 0.75rem;
  border: none;
  border-radius: 50px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s;
}

.btn-primary:hover {
  background-color: #006d6d;
}

.auth-buttons {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.btn-dark,
.btn-google {
  width: 100%;
  padding: 0.75rem;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  font-weight: bold;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
}

.btn-dark {
  background-color: #f4a213;
  color: white;
}

.btn-google {
  background-color: #fff;
  color: #444;
  border: 1px solid #ccc;
}

.google-icon {
  background: #fbbc05;
  color: white;
  border-radius: 50%;
  padding: 0.3rem 0.6rem;
  font-weight: bold;
}
</style>
