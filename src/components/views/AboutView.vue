<template>
  <div class="container text-start py-5">
    <div class="row align-items-center">
      <!-- Text Section -->
      <div class="col-lg-6 mb-4 mb-lg-0">
        <h1 class="fw-bold mb-3">About Us</h1>
        <p class="fs-6 text-muted mb-4">
          Welcome to 234 AFRICA, your premier event ticketing platform dedicated
          to connecting people with unforgettable experiences across Africa.
        </p>
        <p class="fs-6 text-muted">
          Our platform connects event organizers and attendees in a seamless
          way, giving you real-time access to tickets, event details, and more.
        </p>
        <p class="fs-6 text-muted">
          Join our growing community and never miss out on the next big thing
          around you!
        </p>
      </div>

      <!-- Image Section -->
      <div class="col-lg-6 text-center">
        <img
          src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d"
          alt="People enjoying an event"
          class="img-fluid rounded"
        />
      </div>
    </div>
  </div>
</template>
<script>
import barchart from "../charts/barChart.vue";
import { mapGetters } from "vuex";

import axios from "axios";

export default {
  components: {
    barchart,
  },
  data() {
    return {
      revenues: "",
    };
  },

  computed: {
    ...mapGetters([
      "getOrders",
      "getProducts",
      "deliveredCount",
      "cancelledCount",
      "onDeliveryCount",
      "allProducts",
      "allOrders",
      "getUsers",
      "allOrdersLength",
      "totalUsers",
      "totalUserPercent",
      "totalPercentage",
      "totalPercent",
      "totalOrdersPercentage",
      "totalOrdersPrice",
    ]),
    orders() {
      return this.getOrders;
    },
    products() {
      return this.getProducts;
    },
    users() {
      return this.getUsers;
    },
  },
  mounted() {
    this.$store.dispatch("fetchOrders");

    this.$store.dispatch("fetchProducts");
    this.$store.dispatch("fetchUsers");
    axios
      .get(`https://event-ticket-qa70.onrender.com/api/revenue`, {})
      .then((response) => {
        this.revenues = response.data.revenues;

        const options = {
          series: [
            {
              name: "Income",
              data: [],
            },
            {
              name: "Expenses",
              data: [],
            },
          ],
          chart: {
            type: "area",
          },
          xaxis: {
            categories: [],
          },
        };

        this.revenues.forEach((revenue) => {
          options.series[0].data.push(revenue.income);
          options.series[1].data.push(revenue.expenses);
          options.xaxis.categories.push(
            new Date(revenue.time).toLocaleDateString()
          );
        });

        var chart = new ApexCharts(document.querySelector("#chart"), options);
        chart.render();
      })
      .catch((error) => {
        console.log(error);
      });
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
