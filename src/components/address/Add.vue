<template>
  <div class="p-5">
    <p class="text-dark">{{ message }}</p>
    <div

      v-for="(address,index) in addresses"
      :key="address._id"
    >

      <li>
        <h5>
          <!-- Address Fullname -->
          <b>{{ address.fullName }}</b>
        </h5>
      </li>
      <!-- Address street address -->
      <li>{{ address.streetAddress }}</li>
      <li>{{ address.city }}</li>
       <li>{{ address.phoneNumber }}</li>
      <button
      class="btn-danger"

        @click="onDeleteAddress(address._id)"
      >Delete</button>
      &nbsp; | &nbsp;
      <!-- Set Address as Default -->
      <button
      class="btn-secondary"

        @click="onSetDefault(address._id)"
      >Set as Default</button>
    </div>

  </div>
</template>

<script>
import { mapActions } from "vuex";
import axiosInstance from "../../helpers/axiosInstance";



export default {
  name: "Products",
  data() {
    return {
      addresses: [],
      message: "",
      products: [],
      token: ""
    };
  },
  created() {

  },
  mounted() {

    axiosInstance
      .get("/auth/user", {

      })
      .then(res => {
      //  console.log(res);
        this.name = res.data.user.name;
        this.email = res.data.user.email;
      })
      .catch(error => {
        console.log(error);
      });
    axiosInstance
      .get("/addresses", {

      })
      .then(res => {
       // console.log(res);

        this.addresses = res.data.addresses;
      });
  },

  methods: {
    ...mapActions(["addProductToCart"]),
    logout() {
      localStorage.clear();
      this.$router.push("/login");
    },

    onDeleteAddress(id, index) {

      axiosInstance
        .delete(`/addresses/${id}`, {

        })
        .then(response => {
        //  console.log(response);
          this.message = response.message;
          this.addresses.splice(index, 1);
        })
        .catch(error => {
          console.log(error);
        });
    },

    onSetDefault(id) {


      axiosInstance
        .put(
          `/addresses/set/default`,
          { id: id },
          //token:token,
          {

          }
        )
        .then(res => {
          this.message = res.data.message;

         // console.log(id);
         // console.log(res);
        })
        .catch(error => {
          this.message = error.message;
          console.log(error);
        });
    }
  }
};
</script>
