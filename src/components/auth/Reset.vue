<template>
  <div>

    <body class="h-100 pt-5">
      <div class="authincation h-100">
        <div class="container h-100">
          <div class="row justify-content-center h-100 align-items-center">
            <div class="col-md-6">
              <div class="authincation-content">
                <div class="row no-gutters">
                  <div class="col-xl-12">
                    <div class="auth-form">
                      <h4 class="text-center mb-4">Update Password</h4>
                      <form   @submit.prevent="handleSubmit">
                        <div class="form-group">
                          <label><strong>password</strong></label>
                          <input
                             class="form-control"
                    id="inputPasswordOld"
                    required=""
                    type="password"
                    v-model="password"
                          >
                        </div>
                        <div class="text-center">
                          <button
                            type="submit"
                            class="btn btn-primary btn-block"
                          >SUBMIT</button>
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

      <!--**********************************
        Scripts
    ***********************************-->
      <!-- Required vendors -->

    </body>
  </div>

</template>

<script>
import axios from "axios";
import Swal from "sweetalert2";
export default {
  data() {
    return {
      password: "",
      message: ""
    };
  },
  mounted() {
    //  console.log(this.$route.query.token);
  },
  methods: {
    async handleSubmit() {
      const response = await axios
        .post("https://event-ticket-qa70.onrender.com/api/auth/updatePassword", {
          password: this.password,
          token: this.$route.query.token
        })
        .then(response => {

          this.message = response.data.message;
            Swal.fire(response.data.message);
        })
        .catch(err => console.log(err));
      console.log(response);
    },
    clear() {
      this.$refs.form.reset();
    }
  }
};
</script>