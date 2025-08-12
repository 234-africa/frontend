<template>
  <div class="container text-start">
    <nav class="navbar navbar-expand-md navbar-light bg-white">
      <div class="container-fluid p-0">
        <a class="navbar-brand text-uppercase fw-800" href="#">
          <span class="border-red pe-2">Products</span>
          {{ products.length }} found
        </a>

        <button
          class="navbar-toggler d-md-none"
          @click="openModal"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#myNav"
          aria-controls="myNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="fas fa-bars"></span>
        </button>
      </div>
    </nav>
    <div class="d-md-none">
      <!-- Modal -->
      <div v-if="isModalOpen" class="modal" @click.self="closeModal">
        <div class="modal-content text-start"></div>
      </div>
    </div>
    <div class="row">
      <!-- Product Display -->
      <div class="" v-if="products.length > 0">
        <div class="row">
          <div
            class="col-md-4 pt-3 pt-md-0"
            v-for="product in products"
            :key="product._id"
          >
            <div>
           <img
  :src="product.photos[0] || 'https://via.placeholder.com/400x300?text=No+Image'"
  class="img-fluid rounded w-100"
  style="height: 200px; object-fit: cover"
  alt="Event Image"
/>


              <div class="pt-2">
                <div>
                  <h5>{{ product.title }}</h5>

                  <p class="mb-1">
                    <i class="bi bi-calendar-event me-2"></i>
                    {{ formatDate(product.event.date) }}
                  </p>

                  <p class="mb-1">
                    <i class="bi bi-geo-alt me-2"></i>
                    {{ product.event.location || "No location" }}
                  </p>

                  <p>{{ formatPrice(product.price) }}</p>
                </div>

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

      <p v-else>No products found in this category.</p>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import axios from "axios";

export default {
  data() {
    return {
      // Price range data
      minPrice: 0,
      maxPrice: 1000,
      selectedMinPrice: 0,
      selectedMaxPrice: 1000,
      isModalOpen: false,
      products: [],
      searchQuery: "",
    };
  },

  computed: {},

  async created() {
    const slug = this.$route.params.categoryType;

    // Convert slug to readable category name
    const categoryType = slug.replace(/-/g, " ");

    // Optional: Capitalize if needed (depends on backend)
    const finalCategory = categoryType.replace(/\b\w/g, (l) => l.toUpperCase());

    const response = await axios.get(
      `https://event-ticket-qa70.onrender.com/api/categories/${encodeURIComponent(
        finalCategory
      )}`
    );
    console.log("Category Products Response:", response.data);

    this.products = response.data.products;
  },

  methods: {
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
    },
    formatDate(date) {
      if (!date) return "No date";
      const options = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      };
      return new Date(date).toLocaleDateString("en-US", options);
    },
    formatPrice(price) {
      if (!price || price === 0) return "Free";
      return `$${price}`;
    },
  },
};
</script>

<style>
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5); /* Semi-transparent black background */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  visibility: visible;
  opacity: 1;
  transition: opacity 0.3s ease-in-out;
}

/* Modal Content */
.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  text-align: center;
  max-width: 90%;
  max-height: 80%;
  overflow-y: auto;
  z-index: 1001;
}

/* Button to close the modal */
.btn-icon i {
  font-size: 16px; /* Adjust the size to fit your needs */
}

.btn-icon {
  background-color: transparent;
  border: none;
  padding: 5px;
  cursor: pointer;
}
.filter-section {
  background-color: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.filter-title {
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 10px;
  color: #333;
}

.form-label {
  font-weight: bold;
  margin-bottom: 5px;
  color: #444;
}

.form-control {
  padding: 0.8rem;
  font-size: 1rem;
  border-radius: 5px;
  border: 1px solid #ccc;
}

.form-check {
  margin-bottom: 10px;
  font-size: 1rem;
}

.form-check-input {
  margin-right: 8px;
}

.form-check-label {
  font-size: 1rem;
  color: #555;
  cursor: pointer;
}

.form-check-label:hover {
  color: #007bff;
}

.form-range {
  width: 100%;
  height: 5px;
  background-color: #dcdfe1;
  border-radius: 10px;
  -webkit-appearance: none;
  appearance: none;
}

.form-range::-webkit-slider-thumb {
  width: 20px;
  height: 20px;
  background-color: #007bff;
  border-radius: 50%;
  cursor: pointer;
}

.slider-value {
  margin-top: 10px;
  font-weight: 500;
  color: #007bff;
}

.container .product-item {
  min-height: 450px;
  border: none;
  overflow: hidden;
  position: relative;
  border-radius: 0;
}

.container .product-item .product {
  width: 100%;
  height: 350px;
  position: relative;
  overflow: hidden;
  cursor: pointer;
}

.container .product-item .product img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.container .product-item .product .icons .icon {
  width: 40px;
  height: 40px;
  background-color: #fff;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: transform 0.6s ease;
  transform: rotate(180deg);
  cursor: pointer;
}

.container .product-item .product .icons .icon:hover {
  background-color: #b71c1c;
  color: #fff;
}

.container .product-item .product .icons .icon:nth-last-of-type(3) {
  transition-delay: 0.2s;
}

.container .product-item .product .icons .icon:nth-last-of-type(2) {
  transition-delay: 0.15s;
}

.container .product-item .product .icons .icon:nth-last-of-type(1) {
  transition-delay: 0.1s;
}

.container .product-item:hover .product .icons .icon {
  transform: translateY(-60px);
}

.container .product-item .tag {
  text-transform: uppercase;
  font-size: 0.75rem;
  font-weight: 500;
  position: absolute;
  top: 10px;
  left: 20px;
  padding: 0 0.4rem;
}

.container .product-item .title {
  font-size: 0.95rem;
  letter-spacing: 0.5px;
}

.container .product-item .fa-star {
  font-size: 0.65rem;
  color: goldenrod;
}

.container .product-item .price {
  font-weight: bold;

  font-size: 20px;
}
</style>
