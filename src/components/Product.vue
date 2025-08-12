<template>
  <div class="text-start my-5">
    <div class="background-wrapper container">
      <img
        class="img-fluid"
        :src="
          product.photos[0] ||
          'https://via.placeholder.com/400x300?text=No+Image'
        "
      />

      <!-- Main content -->
    </div>
    <div class="container">
      <!-- Blurred background -->

      <div class="row pt-3 text-start">
        <!-- IMAGE COLUMN -->
        <div class="col-md-6">
          <div class="tab-content"></div>
          <div class="">
            <!-- Event Title -->
            <h2 class="fw-bold">{{ product.title }}</h2>

            <!-- Date, Time, Location -->
            <div class="mt-3">
              <p class="mb-1">
                    <i class="bi bi-calendar-event me-2"></i>
                    {{ formatDate(product.event.start)  }} <span v-if="product.event.end" >- {{ formatDate(product.event.end)  }} </span>
                  </p>

              <p class="mb-2">
                <i class="bi bi-clock me-2"></i>
                {{ product.event.startTime }} -
                {{ product.event.endTime }}
              </p>
              <p class="mb-2">
                <i class="bi bi-geo-alt me-2"></i>
                {{ product.event.location.name || "No location" }}
              </p>
               {{ product.description }}

              <div v-if="coordinates" class="mt-4">
                <iframe
                  :src="mapUrl"
                  width="100%"
                  height="300"
                  style="border: 0"
                  allowfullscreen=""
                  loading="lazy"
                  referrerpolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </div>

            <!-- Address Tag -->

            <div
              class="card shadow-sm custom-card-mobile mt-3 d-block d-md-none"
            >
              <!-- Price -->
              <div
                class="d-flex justify-content-between align-items-center mb-3"
              >
                <span class="text-muted fw-medium">Price</span>
                <span class="fw-bold fs-5"
                  >${{ formatPrice(product.price) }}</span
                >
              </div>

              <!-- Get Tickets Button -->
              <div class="d-grid mb-2">
                <router-link
                  to="/checkout"
                  @click.native="addProductToCart(product)"
                  class="btn btn-primary text-dark w-100 text-decoration-none"
                >
                  Get Tickets
                </router-link>
              </div>
            </div>

           
            <hr />

            <!-- TAGS SECTION -->
            <div class="mb-5">
              <h5 class="fw-bold text-dark">Tags</h5>
              <div class="d-flex flex-wrap gap-2 mt-3">
                <div>
                  <span
                    v-for="(tag, index) in product.tag"
                    :key="index"
                    class="tag-badge"
                  >
                    #{{ tag }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Thumbnails -->
         
        </div>
        <div class="col-md-6">
          <div class="card shadow-sm custom-card d-none d-md-block">
            <!-- Price -->
            <div class="d-flex justify-content-between align-items-center mb-3">
              <span class="text-muted fw-medium">Price</span>
              <span class="fw-bold fs-5">{{ formatPrice(product.price) }}</span>
            </div>

            <!-- Get Tickets Button -->
            <div class="d-grid mb-2">
              <router-link
                  to="/checkout"
                  @click.native="addProductToCart(product)"
                  class="btn btn-primary text-dark w-100 text-decoration-none"
                >
                  Get Tickets
                </router-link>
            </div>
          </div>
        </div>

      
        <h1 class="text-start fw-bold">You may also like</h1>
        <div
          class="col-md-4 pt-3 pt-md-0"
          v-for="product in products"
          :key="product._id"
        >
          <div>
            <img
              :src="
                product.photos[0] ||
                'https://via.placeholder.com/400x300?text=No+Image'
              "
              class="img-fluid rounded w-100"
              style="height: 200px; object-fit: cover"
              alt="Event Image"
            />
            <div class="pt-2">
              <h5>{{ product.title }}</h5>
                  <p class="mb-1">
                    <i class="bi bi-calendar-event me-2"></i>
                    {{ formatDate(product.event.start)  }} <span v-if="product.event.end" >- {{ formatDate(product.event.end)  }} </span>
                  </p>
              <p class="mb-1">
                <i class="bi bi-geo-alt me-2"></i>
                {{ product.event.location.name || "No location" }}
              </p>
              <p>{{ formatPrice(product.price) }}</p>
              <button
                class="btn btn-outline-primary"
                @click="goToProduct(product.title)"
              >
                View Event
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { mapActions } from "vuex";

export default {
  props: {
    product: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      products: [],
      product: {
        photos: [],
        price: 0, // Default price
      },
      selectedTab: 0,
      quantity: 1, // Default quantity,
      coordinates: null, // Coordinates for Google Maps
      API_KEY: "AIzaSyCkbHZXmqyIxjFpN8bMvDeURTmlpEhDHv4", // ⚠️ Replace with your actual key
    };
  },

  async created() {
    try {
      // Retrieve the raw product title from Vuex
      let productTitle = this.$store.getters.getProductUrl;
      console.log("Raw Product Title from Vuex:", productTitle);

      // Send the raw title to the backend (encode for HTTP request)
      const response = await axios.get(
        `https://event-ticket-qa70.onrender.com/api/products/${encodeURIComponent(
          productTitle
        )}`
      );

      this.product = response.data.product || {};

      this.coordinates = this.product.event.location.coordinates || null;
    } catch (error) {
      console.error("Error fetching product details:", error);
    }

    try {
      const response = await axios.get(
        `https://event-ticket-qa70.onrender.com/api/products`
      );
      console.log("API Response:", response.data);

      this.products = this.shuffleArray(response.data.products || []).slice(
        0,
        3
      );
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  },
  computed: {
    mapUrl() {
      if (!this.coordinates) return "";
      const { lat, lng } = this.coordinates;
      return `https://www.google.com/maps/embed/v1/view?key=${this.API_KEY}&center=${lat},${lng}&zoom=15`;
    },
    totalPrice() {
      return this.product.price * this.quantity;
    },
    productTitle() {
      return this.$store.state.productTitle;
    },
  },
  methods: {
    ...mapActions(["addProductToCart"]),
    formatDate(date) {
      if (!date) return "No date";
      const options = {
        weekday: "short",
        //year: "numeric",
        month: "short",
        day: "numeric",
      };
      return new Date(date).toLocaleDateString("en-US", options);
    },
    formatPrice(price) {
      if (!price || price === 0) return "Free";
      return `$${price}`;
    },
    slugify(text) {
      return text
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-") // Replace spaces with hyphens
        .replace(/[^\w\s'-]/g, ""); // Remove special characters, keep apostrophes
    },
    goToProduct(productTitle) {
      // Normalize the product title for the URL: Replace spaces with hyphens
      let normalizedProductTitle = productTitle.replace(/\s+/g, "-");

      console.log("Normalized Product Title for URL:", normalizedProductTitle);

      // Store the raw title in Vuex (for the backend)
      this.$store.dispatch("setProductUrl", productTitle);

      // Use the normalized title in the URL (for better SEO)
      this.$router.push({
        name: "ProductDetails",
        params: { title: normalizedProductTitle }, // For URL with hyphens
      });
      window.location.reload();
    },

    buyNow(product) {
      this.addProductToCart(product); // Add product to cart
      this.$router.push("/cart"); // Redirect to checkout page
    },
    shuffleArray(array) {
      return array.sort(() => Math.random() - 0.5);
    },
    onChangeQuantity(event, product) {
      let qty = parseInt(event.target.value);
      console.log("Selected Quantity:", qty);

      if (!isNaN(qty)) {
        this.quantity = qty;
        this.$store.commit("changeQty", { product, qty });
      } else {
        console.error("Invalid Quantity Selected");
      }
    },
  },
  watch: {
    product: {
      handler(newProduct) {
        if (newProduct && newProduct.photos && newProduct.photos.length > 0) {
          this.selectedPhoto = newProduct.photos[0];
        }
      },
      deep: true,
      immediate: true,
    },
  },
};
</script>

<style scoped>
.content-wrapper {
  position: relative;
  z-index: 1;
  padding: 2rem;
}

.content-wrapper {
  position: relative;
  z-index: 1;
  padding: 2rem;
}
.custom-card {
  position: sticky;
  top: 0;
  z-index: 1020; /* Similar to Bootstrap sticky-top z-index */
  width: 75%;
  padding: 1rem;
  height: fit-content;
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075); /* shadow-sm */
  background-color: #fff;
  border-radius: 0.25rem;
  display: none; /* Hide by default */
}
.custom-card-mobile {
  position: sticky;
  top: 0;
  z-index: 1020; /* Similar to Bootstrap sticky-top z-index */
  width: 100%;
  padding: 1rem;
  padding-top: 20px;
  height: 15%;
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075); /* shadow-sm */
  background-color: #fff;
  border-radius: 0.25rem;
  display: none; /* Hide by default */
}
</style>
