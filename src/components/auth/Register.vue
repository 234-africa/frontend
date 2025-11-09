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
  border: 2px solid #dc3545 !important;
  animation: shake 0.3s;
  background: #fff5f5 !important;
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
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 3rem 1rem;
}

.signup-container {
  max-width: 450px;
  width: 100%;
}

.signup-card {
  background: white;
  border-radius: 20px;
  padding: 3rem 2.5rem;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.signup-card:hover {
  box-shadow: 0 15px 50px rgba(0, 0, 0, 0.15);
  transform: translateY(-5px);
}

.signup-title {
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
  text-transform: capitalize;
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

.error {
  font-size: 0.85rem;
  margin-top: 0.5rem;
  font-weight: 500;
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

@media (max-width: 576px) {
  .signup-card {
    padding: 2rem 1.5rem;
  }

  .signup-title {
    font-size: 1.6rem;
  }
}
</style>
