<template>
  <div>
    <h1>Orders</h1>
    <div v-if="loading">Loading...</div>
    <div v-else-if="error">{{ error }}</div>
    <ul v-else>
      <li v-for="order in orders" :key="order._id">
        Order ID: {{ order._id }} | Total: {{ order.total }}
      </li>
    </ul>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'Orders',
  data() {
    return {
      orders: [],
      loading: true,
      error: null,
    };
  },
  mounted() {
    this.fetchOrders();
  },
  methods: {
    async fetchOrders() {
      try {
        const response = await axios.get('https://event-ticket-qa70.onrender.com/api/orders'); // update with your actual backend URL
        this.orders = response.data.orders;
      } catch (err) {
        this.error = 'Failed to fetch orders';
        console.error(err);
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>
