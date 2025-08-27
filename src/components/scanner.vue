<template>
  <div class="container text-start">
    <h2>Staff Products</h2>

    <div v-if="loading">Loading...</div>
    <div v-else>
      <div class="row">
        <!-- Products Section -->
        <div class="col-md-8">
          <div
            v-for="(product, index) in products"
            :key="index"
            class="card mb-4 shadow-sm border-0"
          >
            <!-- Image -->
            <img
              v-if="product.productID.photos && product.productID.photos.length"
              :src="product.productID.photos[0]"
              alt="Product Image"
              class="card-img-top"
              style="height: 200px; object-fit: cover"
            />

            <!-- Card Body -->
            <div class="card-body">
              <h5 class="card-title">{{ product.productID.title }}</h5>

              <!-- Event Info -->
              <div class="border-top pt-2 mt-2">
                <h6 class="fw-bold">Event Info</h6>
                <p class="mb-1">
                  <strong>Location:</strong> {{ product.productID.event.location.name }}
                </p>
                <p class="mb-1">
                  <strong>Start:</strong>
                  {{ formatDate(product.productID.event.start) }} at
                  {{ product.productID.event.startTime }}
                </p>
                <p class="mb-1">
                  <span v-if="product.productID.event.end"
                    >- {{ formatDate(product.productID.event.end) }} at
                  </span>
                </p>
              </div>

              <!-- Tickets -->
              <div class="border-top pt-2 mt-2">
                <h6 class="fw-bold">Tickets</h6>
                <ul class="list-unstyled mb-0">
                  <li
                    v-for="ticket in product.productID.event.tickets"
                    :key="ticket._id"
                    class="d-flex justify-content-between"
                  >
                    <span>{{ ticket.name }}</span>
                    <span class="text-muted">
                      ${{ ticket.price }} ({{ ticket.quantity }} left)
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <!-- Scanner Section -->
        <div class="col-md-4">
          <div class="card shadow-sm border-0 h-100">
            <div class="text center bg-success p-2" style="color: white">
              <h5 class="mb-0">Scanner</h5>
            </div>
            <div class="card-body d-flex align-items-center justify-content-center">
              <Scanner />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import Scanner from "./app/admin/scanner.vue";

export default {
  components: {
    Scanner,
  },
  data() {
    return {
      products: [],
      loading: true,
    };
  },
  async mounted() {
    try {
      const token = localStorage.getItem("staffToken");
      console.log(token);
      const res = await axios.get("https://event-ticket-backend-gnmw.onrender.com/api/staff", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(token);
      this.products = res.data.products; // get the nested products array
    } catch (err) {
      console.error("Error fetching staff products:", err);
    } finally {
      this.loading = false;
    }
  },
  methods: {
    formatDate(dateStr) {
      const date = new Date(dateStr);
      return date.toLocaleDateString();
    },
  },
};
</script>

<style scoped>
.container {
  padding: 20px;
}
.product-card {
  border: 1px solid #ddd;
  padding: 15px;
  margin-bottom: 15px;
  border-radius: 6px;
  background: #fafafa;
}
.product-img {
  max-width: 200px;
  display: block;
  margin: 10px 0;
}
</style>
