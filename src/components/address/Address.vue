<template>
  <div>
    <label style="margin-bottom: 0px;">Full Name</label>
    <input type="text" v-model="fullName" class="a-input-text" style="width: 100%;">
    <label style="margin-bottom: 0px;">Street Address</label>
    <input
      type="text"
      v-model="streetAddress1"
      class="a-input-text"
      style="width: 100%;"
      placeholder="Street and number, P.O. box, c/o."
    >
    <span class="a-button-text" @click="submit">Add address</span>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data: () => ({
    country: "",
    fullName: "",
    streetAddress1: "",
    streetAddress2: "",
    city: "",
    state: "",
    zipCode: "",
    phoneNumber: "",
    deliveryInstructions: "",
    securityCode: ""
  }),
  created() {
    //user is not authorized
    if (localStorage.getItem("token") === null) {
      this.$router.push("/login");
    }
  },
  methods: {
    submit() {
      const token = localStorage.getItem("token");
      return axios({
        method: "post",
        data: {
          country: this.country,
          fullName: this.fullName,
          streetAddress: this.streetAddress1 + " " + this.streetAddress2,
          city: this.city,
          state: this.state,
          zipCode: this.zipCode,
          phoneNumber: this.phoneNumber,
          deliverInstructions: this.deliveryInstructions,
          securityCode: this.securityCode
        },
        url: "https://event-ticket-qa70.onrender.com/api/addresses",

        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer" + token,
          "x-access-token": token
        }
      })
        .then(response => {
        //  console.log(response);
            this.$router.push(  "/add" );
        })
        .catch(error => {
        //  console.log(error);
        });
    },
    clear() {}
  }
};
</script>
