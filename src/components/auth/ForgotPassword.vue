<template>
  <div>
    <div class="h-100 pt-5">
      <div class="authincation h-100">
        <div class="container h-100">
          <div class="row justify-content-center h-100 align-items-center">
            <div class="col-md-6">
              <div class="authincation-content">
                <div class="row no-gutters">
                  <div class="col-xl-12">
                    <div class="auth-form">
                      <h4 class="text-center mb-4">Forgot Password</h4>
                      <form @submit.prevent="handleSubmit">
                        <div class="form-group">
                          <label><strong>Email</strong></label>
                          <input
                            type="email"
                            class="form-control"
                            placeholder="hello@example.com"
                            v-model="email"
                          />
                        </div>
                        <div class="text-center">
                          <button type="submit" class="btn btn-primary btn-block">
                            SUBMIT
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
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
<<<<<<< HEAD
        .post("https://event-ticket-backend-yx81.onrender.com/api/auth/forgotPassword", {
=======
        .post("https://event-ticket-qa70.onrender.com/api/auth/forgotPassword", {
>>>>>>> 24f4f118 (m)
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
