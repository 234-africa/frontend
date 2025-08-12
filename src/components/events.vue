<template>
  <div>
    <!-- 🔍 Search & Filters -->
    <div class="container-fluid bg-light">
      <div class="section_discover">
        <div class="container-large">
          <div class="row pt-2 pb-2">
            <!-- 🔍 Search Input -->
            <div class="col-12  pt-2 pb-md-0 pb-1 col-md-6">
              <input
                v-model="searchTerm"
                type="text"
                class="form-control"
                placeholder="Search events by title"
              />
            </div>

            <!-- 🧩 Filter Buttons -->
            <div class="col-12 col-md-6 pt-1">
              <div
                class="d-flex flex-column flex-md-row align-items-center justify-content-md-end gap-2"
              >
                <button
                  class="btn btn-outline-dark w-100 w-md-auto"
                  @click="showPriceModal = true"
                >
                  Price
                </button>
                <button
                  class="btn btn-outline-dark w-100 w-md-auto"
                  @click="showDateModal = true"
                >
                  Date
                </button>
                <a
                  href="#"
                  class="text-muted text-decoration-none"
                  @click.prevent="resetSearch"
                >
                  Reset Filters
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 💰 Price Modal -->
    <div
      v-if="showPriceModal"
      class="modal"
      @click.self="showPriceModal = false"
    >
      <div class="modal-content">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h5 class="m-0 fw-bold">Price</h5>
          <button class="btn-icon" @click="showPriceModal = false">
            <i class="bi bi-x-lg"></i>
          </button>
        </div>

        <div class="row">
          <div class="col">
            <label>Minimum amount</label>
            <input
              v-model.number="tempFilters.minPrice"
              type="number"
              class="form-control"
            />
          </div>
          <div class="col">
            <label>Maximum amount</label>
            <input
              v-model.number="tempFilters.maxPrice"
              type="number"
              class="form-control"
            />
          </div>
        </div>

        <div class="d-flex justify-content-between mt-4">
          <button class="btn btn-outline-secondary" @click="clearPriceFilters">
            Clear
          </button>
          <button class="btn btn-primary" @click="applyPriceFilters">
            Apply
          </button>
        </div>
      </div>
    </div>

    <!-- 📅 Date Modal -->
    <div v-if="showDateModal" class="modal" @click.self="showDateModal = false">
      <div class="modal-content">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h5 class="m-0 fw-bold">Date</h5>
          <button class="btn-icon" @click="showDateModal = false">
            <i class="bi bi-x-lg"></i>
          </button>
        </div>

        <div class="d-flex justify-content-center gap-3 mb-3">
          <button class="btn btn-outline-dark" @click="setToday">Today</button>
          <button class="btn btn-outline-dark" @click="setTomorrow">
            Tomorrow
          </button>
          <button class="btn btn-outline-dark" @click="setThisWeekend">
            This weekend
          </button>
        </div>

        <div class="row">
          <div class="col">
            <input
              v-model="tempFilters.startDate"
              type="date"
              class="form-control"
            />
          </div>
          <div class="col">
            <input
              v-model="tempFilters.endDate"
              type="date"
              class="form-control"
            />
          </div>
        </div>

        <div class="d-flex justify-content-between mt-4">
          <button class="btn btn-outline-secondary" @click="clearDateFilters">
            Clear
          </button>
          <button class="btn btn-primary" @click="applyDateFilters">
            Apply
          </button>
        </div>
      </div>
    </div>

    <!-- 🗂 Event List -->
    <div class="container-fluid">
      <div class="section_discover pt-4">
        <div class="container-large mb-3">
          <h3 class="mb-3">Explore {{ filteredProducts.length }} Events</h3>

          <div v-if="filteredProducts.length === 0" class="alert alert-warning">
            No events match your search.
          </div>

          <div class="row">
            <div
              class="col-md-4 pt-3 "
              v-for="product in filteredProducts"
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
                    class="btn btn-outline-primary btn-sm"
                    @click="goToProduct(product.title)"
                  >
                    View Event
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div class="row g-4"><div class="col-md-6"></div></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { ref } from "vue";

export default {
  name: "ProductList",
  data() {
    return {
      products: [],
      reference: "",
      loading: true,
      searchTerm: "",
      filters: {
        minPrice: 0,
        maxPrice: Infinity,
        startDate: null,
        endDate: null,
      },
      tempFilters: {
        minPrice: 0,
        maxPrice: 100000,
        startDate: null,
        endDate: null,
      },
      showPriceModal: false,
      showDateModal: false,
    };
  },
  computed: {
    filteredProducts() {
      const term = this.searchTerm.toLowerCase();

      return this.products.filter((product) => {
        const titleMatch = product.title?.toLowerCase().includes(term);
        const locationMatch = product.event?.location?.name
          ?.toLowerCase()
          .includes(term.toLowerCase());
        const price = product.price || 0;
        const priceMatch =
          (!this.filters.minPrice || price >= this.filters.minPrice) &&
          (!this.filters.maxPrice || price <= this.filters.maxPrice);

        const eventDate = new Date(product.event?.date);
        const startDate = this.filters.startDate
          ? new Date(this.filters.startDate)
          : null;
        const endDate = this.filters.endDate
          ? new Date(this.filters.endDate)
          : null;

        // Remove time from comparisons to match only by date
        const eventDateOnly = new Date(eventDate.toDateString());
        const startDateOnly = startDate
          ? new Date(startDate.toDateString())
          : null;
        const endDateOnly = endDate ? new Date(endDate.toDateString()) : null;

        const dateMatch =
          (!startDateOnly || eventDateOnly >= startDateOnly) &&
          (!endDateOnly || eventDateOnly <= endDateOnly);

        return (titleMatch || locationMatch) && priceMatch && dateMatch;
      });
    },
  },
  methods: {
    async fetchProducts() {
      try {
        const res = await axios.get(
          "https://event-ticket-qa70.onrender.com/api/products"
        );
        this.products = res.data.products;
        console.log(this.products)
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    },
    goToProduct(productTitle) {
      const normalizedProductTitle = productTitle.replace(/\s+/g, "-");
      this.$store.dispatch("setProductUrl", productTitle);
      this.$router.push({
        name: "ProductDetails",
        params: { title: normalizedProductTitle },
      });
    },
    formatDate(date) {
      if (!date) return "";
      const options = {
        weekday: "short",
       // year: "numeric",
        month: "short",
        day: "numeric",
      };
      return new Date(date).toLocaleDateString("en-US", options);
    },
    formatPrice(price) {
      if (!price || price === 0) return "Free";
      return `$${price}`;
    },
    resetSearch() {
      this.searchTerm = "";
      this.filters = {
        minPrice: 0,
        maxPrice: Infinity,
        startDate: null,
        endDate: null,
      };
    },
    applyPriceFilters() {
      this.filters.minPrice = this.tempFilters.minPrice;
      this.filters.maxPrice = this.tempFilters.maxPrice;
      this.showPriceModal = false;
    },
    clearPriceFilters() {
      this.tempFilters.minPrice = 0;
      this.tempFilters.maxPrice = 100000;
      this.applyPriceFilters();
    },
    applyDateFilters() {
      this.filters.startDate = this.tempFilters.startDate;
      this.filters.endDate = this.tempFilters.endDate;
      this.showDateModal = false;
    },
    clearDateFilters() {
      this.tempFilters.startDate = null;
      this.tempFilters.endDate = null;
      this.applyDateFilters();
    },
    setToday() {
      const today = new Date().toISOString().split("T")[0];
      this.tempFilters.startDate = today;
      this.tempFilters.endDate = today;
    },
    setTomorrow() {
      const tomorrow = new Date(Date.now() + 86400000)
        .toISOString()
        .split("T")[0];
      this.tempFilters.startDate = tomorrow;
      this.tempFilters.endDate = tomorrow;
    },
    setThisWeekend() {
      const today = new Date();
      const day = today.getDay();
      const saturday = new Date(today);
      saturday.setDate(today.getDate() + (6 - day));
      const sunday = new Date(saturday);
      sunday.setDate(saturday.getDate() + 1);
      this.tempFilters.startDate = saturday.toISOString().split("T")[0];
      this.tempFilters.endDate = sunday.toISOString().split("T")[0];
    },
  },
  mounted() {
    this.fetchProducts();
  },
};
</script>

<style scoped>
.search-bar {
  padding: 12px 20px;
  font-size: 1rem;
  border-radius: 8px;
  border: 1px solid #ccc;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  width: 100%;
  transition: all 0.3s ease;
}
.search-bar:focus {
  outline: none;
  border-color: #ffa726;
  box-shadow: 0 0 8px rgba(255, 167, 38, 0.6);
}
.search-bar::placeholder {
  color: #aaa;
  font-style: italic;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1050;
}
.modal-content {
  background: #fff;
  padding: 30px;
  border-radius: 16px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  animation: fadeIn 0.3s ease-in-out;
}
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.btn-icon {
  background: none;
  border: none;
  cursor: pointer;
}
</style>
