<template>
  <div>
    <!-- 🔍 Search & Filters -->
    <div class="container-fluid bg-light">
      <div class="section_discover">
        <div class="container-large">
          <div class="row pt-2 pb-2">
            <!-- 🔍 Search Input -->
            <div class="col-12 pt-2 pb-md-0 pb-1 col-md-6">
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
    <div v-if="showPriceModal" class="modal" @click.self="showPriceModal = false">
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
          <button class="btn btn-primary" @click="applyPriceFilters">Apply</button>
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
          <button class="btn btn-outline-dark" @click="setTomorrow">Tomorrow</button>
          <button class="btn btn-outline-dark" @click="setThisWeekend">
            This weekend
          </button>
        </div>

        <div class="row">
          <div class="col">
            <input v-model="tempFilters.startDate" type="date" class="form-control" />
          </div>
          <div class="col">
            <input v-model="tempFilters.endDate" type="date" class="form-control" />
          </div>
        </div>

        <div class="d-flex justify-content-between mt-4">
          <button class="btn btn-outline-secondary" @click="clearDateFilters">
            Clear
          </button>
          <button class="btn btn-primary" @click="applyDateFilters">Apply</button>
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
              class="col-md-4 pt-3"
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
                    {{ formatDate(product.event.start) }}
                    <span v-if="product.event.end"
                      >- {{ formatDate(product.event.end) }}
                    </span>
                  </p>
                  <p class="mb-1">
                    <i class="bi bi-geo-alt me-2"></i>
                    {{ product.event.location.name || "No location" }}
                  </p>
                  <p>
                    {{ getTicketPriceRange(product.event.tickets) }}
                  </p>

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
        const locationMatch = product.event?.location?.name?.toLowerCase().includes(term);

        // ✅ Extract min and max ticket prices
        const tickets = product.event?.tickets || [];
        const sortedTickets = [...tickets].sort((a, b) => a.price - b.price);
        const minTicketPrice = sortedTickets[0]?.price || 0;
        const maxTicketPrice = sortedTickets[sortedTickets.length - 1]?.price || 0;

        // ✅ Adjusted price filter logic
        const priceMatch =
          (!this.filters.minPrice || maxTicketPrice >= this.filters.minPrice) &&
          (!this.filters.maxPrice || minTicketPrice <= this.filters.maxPrice);

        // ✅ Date filters
        const eventDate = new Date(product.event?.start);
        const startDate = this.filters.startDate
          ? new Date(this.filters.startDate)
          : null;
        const endDate = this.filters.endDate ? new Date(this.filters.endDate) : null;

        const eventDateOnly = new Date(eventDate.toDateString());
        const startDateOnly = startDate ? new Date(startDate.toDateString()) : null;
        const endDateOnly = endDate ? new Date(endDate.toDateString()) : null;

        const dateMatch =
          (!startDateOnly || eventDateOnly >= startDateOnly) &&
          (!endDateOnly || eventDateOnly <= endDateOnly);

        return (titleMatch || locationMatch) && priceMatch && dateMatch;
      });
    },
  },
  methods: {
    getTicketPriceRange(tickets) {
      if (!tickets || tickets.length === 0) return "";

      const sorted = [...tickets].sort((a, b) => a.price - b.price);
      const lowest = sorted[0];
      const highest = sorted[sorted.length - 1];

      if (lowest.price === 0 && highest.price === 0) return "Free";
      if (lowest.price === highest.price) return this.formatPrice(lowest.price, lowest.currency);
      
      // If all tickets have the same currency, show range with one currency symbol
      const allSameCurrency = tickets.every(t => t.currency === lowest.currency);
      if (allSameCurrency) {
        return `${this.formatPrice(lowest.price, lowest.currency)} - ${this.formatPrice(highest.price, highest.currency)}`;
      }
      
      // Different currencies: show each with its symbol
      return `${this.formatPrice(lowest.price, lowest.currency)} - ${this.formatPrice(highest.price, highest.currency)}`;
    },
    getCurrencySymbol(currency) {
      const symbols = {
        NGN: "₦",
        USD: "$",
        GBP: "£",
        EUR: "€",
        GHS: "GH₵",
      };
      const normalizedCurrency = currency ? currency.toUpperCase() : "NGN";
      return symbols[normalizedCurrency] || "₦";
    },
    async fetchProducts() {
      try {
        const res = await axios.get("https://event-ticket-backend-yx81.onrender.com/api/products");
        this.products = res.data.products;
        console.log(this.products);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    },
    goToProduct(productTitle) {
      const normalizedProductTitle = productTitle.replace(/\s+/g, "-").toLowerCase();

      // Open in new tab
      window.open(`/event/${normalizedProductTitle}`, "_blank");
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
    formatPrice(price, currency = "NGN") {
      if (!price || price === 0) return "Free";
      return `${this.getCurrencySymbol(currency)}${price}`;
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
      const tomorrow = new Date(Date.now() + 86400000).toISOString().split("T")[0];
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
.container-fluid {
  padding: 0;
}

.bg-light {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%) !important;
}

.section_discover {
  padding: 0;
}

.form-control {
  padding: 14px 18px;
  font-size: 1rem;
  border-radius: 12px;
  border: 2px solid #e0e0e0;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.form-control:focus {
  outline: none;
  border-color: #228B22;
  box-shadow: 0 4px 12px rgba(34, 139, 34, 0.15);
}

.form-control::placeholder {
  color: #999;
}

.btn-outline-dark {
  padding: 10px 24px;
  border-radius: 10px;
  border: 2px solid #333;
  font-weight: 600;
  transition: all 0.3s ease;
  background: white;
}

.btn-outline-dark:hover {
  background: #333;
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.btn-outline-primary {
  padding: 10px 24px;
  border-radius: 10px;
  border: 2px solid #228B22;
  color: #228B22;
  font-weight: 600;
  transition: all 0.3s ease;
  background: white;
}

.btn-outline-primary:hover {
  background: linear-gradient(135deg, #228B22 0%, #047143 100%);
  color: white;
  border-color: #228B22;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(34, 139, 34, 0.3);
}

.text-muted {
  transition: color 0.3s ease;
}

.text-muted:hover {
  color: #DC143C !important;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1050;
  padding: 1rem;
}

.modal-content {
  background: #fff;
  padding: 2rem;
  border-radius: 20px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: slideUp 0.3s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.btn-icon {
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.btn-icon:hover {
  background: #f0f0f0;
  transform: rotate(90deg);
}

.btn-primary {
  background: linear-gradient(135deg, #228B22 0%, #047143 100%);
  border: none;
  padding: 12px 28px;
  border-radius: 10px;
  font-weight: 600;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(34, 139, 34, 0.3);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(34, 139, 34, 0.4);
}

.btn-outline-secondary {
  border-radius: 10px;
  padding: 12px 28px;
  font-weight: 600;
}

.container-large {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
}

h3 {
  font-weight: 700;
  color: #333;
  margin-bottom: 1.5rem;
}

.alert-warning {
  background: #fff3cd;
  border-left: 4px solid #DC143C;
  padding: 1.25rem;
  border-radius: 12px;
  color: #856404;
  font-weight: 500;
}

.col-md-4 {
  margin-bottom: 1.5rem;
}

.img-fluid {
  transition: transform 0.4s ease, box-shadow 0.4s ease;
  border-radius: 16px;
}

.img-fluid:hover {
  transform: scale(1.05);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
}

.pt-2 h5 {
  font-weight: 700;
  color: #333;
  margin-top: 1rem;
  margin-bottom: 0.75rem;
  font-size: 1.25rem;
}

.pt-2 p {
  color: #666;
  font-size: 0.95rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.pt-2 p i {
  color: #228B22;
}

@media (max-width: 768px) {
  .modal-content {
    padding: 1.5rem;
  }

  .container-large {
    padding: 0.75rem;
  }

  .btn-outline-dark,
  .btn-outline-primary {
    width: 100%;
    margin-bottom: 0.5rem;
  }
}

@media (max-width: 576px) {
  .form-control {
    font-size: 0.95rem;
    padding: 12px 16px;
  }

  h3 {
    font-size: 1.5rem;
  }

  .pt-2 h5 {
    font-size: 1.1rem;
  }
}
</style>
