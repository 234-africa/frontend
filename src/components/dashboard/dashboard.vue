<template>
  <div class="container py-4">
    <h2 class="mb-4 text-center">Dashboard Overview</h2>

    <!-- Metrics Row -->
    <div class="row g-3">
    
      <div class="col-md-4">
        <div class="p-3 border rounded text-center bg-light">
          {{ getProductsByUser.length }}

          <p class="mb-1 fw-bold">Total Events</p>
          <small>{{ totalPercentage }}% (30 days)</small>
        </div>
      </div>

      <div class="col-md-4">
        <div class="p-3 border rounded text-center bg-light">
          {{ totalPrice }}
          <p class="mb-1 fw-bold">Total Revenue</p>
          <small>{{ totalOrdersPercentage }}% (30 days)</small>
        </div>
      </div>

      <div class="col-md-4">
        <div class="p-3 border rounded text-center bg-light">
          {{ orders.length }}
          <p class="mb-1 fw-bold">Total Orders</p>
          <small>{{ totalPercent }}% (30 days)</small>
        </div>
      </div>

     
    </div>

    
  </div>
</template>

<script>

import { mapGetters } from "vuex";

import axios from "axios";

export default {
  components: {
   
  },
  data() {
    return {
     
      orders: [],
    };
  },

  computed: {
    ...mapGetters(["getToken", "getProductsByUser"]),

    productsByUser() {
      return this.getProductsByUser;
    },
  },
  methods: {},

  mounted() {
    axios
      .get("https://event-ticket-qa70.onrender.com/api/orders", {
        headers: {
          Authorization: `Bearer ${this.getToken}`,
        },
      })
      .then((response) => {
        this.orders = response.data.orders;
        const total = this.orders.reduce((sum, order) => sum + order.price, 0);
        this.totalPrice = total;

        console.log("Orders fetched:", this.orders);
        console.log("Total price:", this.totalPrice);
      })
      .catch((error) => {
        console.error("Error fetching orders:", error.response?.data || error);
      });

    this.$store.dispatch("fetchProductsByUser");
  },
};
</script>

<style>
.typewriter {
  display: inline-block;
  overflow: hidden;
  animation: typing 2s steps(40, end), blink-caret 0.75s step-end infinite;
}

@keyframes typing {
  from {
    width: 0;
  }
  to {
    width: 100%;
  }
}

@keyframes blink-caret {
  from,
  to {
    border-color: transparent;
  }
  50% {
    border-color: #000;
  }
}
</style>
