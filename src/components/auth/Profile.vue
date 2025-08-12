<template>
  <div  class="p-5">
      <h3>Add address</h3>
    <label style="margin-bottom: 0px;">Full Name</label>
    <input
      type="text"
      v-model="$store.state.address.fullName"
      class="a-input-text form-control"
      style="width: 100%;"
    >
    <label style="margin-bottom: 0px;">Street Address</label>
    <input
      type="text"
      v-model="$store.state.address.streetAddress1"
      class="a-input-text form-control"
      style="width: 100%;"
      placeholder="Street and number, P.O. box, c/o."
    >
    <label style="margin-bottom: 0px;">City</label>
    <input
      type="text"
      v-model="$store.state.address.city"
      class="a-input-text form-control"
      style="width: 100%;"
      placeholder="Street and number, P.O. box, c/o."
    >
     <label style="margin-bottom: 0px;">Number</label>
    <input
      type="text"
      v-model="$store.state.address.phoneNumber"
      class="a-input-text form-control"
      style="width: 100%;"
      placeholder="123456789"
    >

    <button
      class="a-button-text btn-primary mt-4"
      @click="submit"
    >Add address</button>
  </div>
</template>
<script>
// Remove the import statement for axios
import { mapActions } from "vuex";

export default {
  // Remove the data property and created lifecycle hook

  methods: {
    ...mapActions( ["addAddress"]),

    submit() {
      this.addAddress()
        .then(() => {
          this.$router.push("/add");
        })
        .catch(error => {
          console.log(error);
        });
    }
  }
};
</script>
