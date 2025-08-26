<template>
  <div class="signup-wrapper">
    <div class="signup-container">
      <div class="signup-card">
        <h4 class="signup-title">Sign up your account</h4>

        <form @submit.prevent="registerUser">
          <div class="form-group">
            <label class="form-label">Name</label>
            <input
              v-model="name"
              type="text"
              class="form-input"
              placeholder="Name"
              required
            />
          </div>
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
            <label class="form-label">Brand Name</label>
            <input
              v-model="brand"
              type="text"
              class="form-input"
              placeholder="Brand Name"
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
          <div class="form-group">
            <label class="form-label">confirm Password</label>
            <input
              v-model="confirmpassword"
              :class="['form-input', { 'input-error': passwordMismatch }]"
              type="password"
              placeholder="Confirm Password"
              required
            />
            <p v-if="passwordMismatch" class="error text-danger">
              Passwords do not match.
            </p>
          </div>

          <div class="form-submit">
            <button type="submit" class="btn-primary">Sign me up</button>
          </div>
        </form>

        <p class="text-center mt-3">
          Already have an account?
          <router-link to="/login" class="link-blue">Sign in</router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import Swal from "sweetalert2";

export default {
  data() {
    return {
      name: "",
      email: "",
      brand: "",
      password: "",
      confirmpassword: "",
      errorMessage: "",
    };
  },
  computed: {
    passwordMismatch() {
      return (
        this.password && this.confirmpassword && this.password !== this.confirmpassword
      );
    },
  },
  methods: {
    ...mapActions(["REGISTER_USER"]),
    registerUser() {
      if (this.passwordMismatch) {
        this.errorMessage = "Passwords must match.";
        return;
      }
      const payload = {
        name: this.name,
        email: this.email,
        password: this.password,
        brand: this.brand,
      };

      this.REGISTER_USER(payload)
        .then((response) => {
          //const message =response.data.message
          Swal.fire(
            "Registration successful: please check your mailbox to confirm your email"
          );

          // Handle success scenario
          this.$router.push({ name: "login" });
        })
        .catch((err) => {
          const message = err.message;

          Swal.fire("Oh oo!", `${message}`, "error");
          // Handle error scenario
        });
    },
  },
};
</script>
<style scoped>
.input-error {
  border: 1px solid red;
  animation: shake 0.3s;
}

@keyframes shake {
  0% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-3px);
  }
  50% {
    transform: translateX(3px);
  }
  75% {
    transform: translateX(-3px);
  }
  100% {
    transform: translateX(0);
  }
}

.signup-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 3rem 1rem;
}

.signup-container {
  max-width: 400px;
  width: 100%;
}

.signup-card {
  background: white;
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
}

.signup-title {
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

.checkbox-group {
  display: flex;
  align-items: center;
  margin: 1rem 0;
}

.checkbox {
  margin-right: 0.5rem;
}

.checkbox-label {
  font-size: 0.95rem;
  color: #333;
}

.form-submit {
  text-align: center;
  margin-top: 1.5rem;
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

.text-center {
  text-align: center;
}

.link-blue {
  color: teal;
  font-weight: bold;
  text-decoration: none;
  margin-left: 5px;
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
