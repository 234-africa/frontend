<template>
  <div class="product-page text-start my-5">
    <div class="background-wrapper container">
      <img
        class="img-fluid"
        :src="product.photos[0] || 'https://via.placeholder.com/400x300?text=No+Image'"
        :alt="product.title + ' event banner'"
        width="1200"
        height="400"
        loading="eager"
        decoding="async"
        fetchpriority="high"
      />

      <!-- Main content -->
    </div>
    <div class="container">
      <!-- Blurred background -->

      <div class="row pt-3 text-start">
        <!-- IMAGE COLUMN -->
        <div class="col-md-6">
          <div class="">
            <!-- Event Title -->
            <h2 class="fw-bold">{{ product.title }}</h2>

            <!-- Date, Time, Location -->
            <div class="mt-3" v-if="product && product.event">
              <p class="mb-2">
                <i class="bi bi-calendar-event me-2"></i>
                {{ formatDate(product.event.start) }}
                <span v-if="product.event.end">
                  - {{ formatDate(product.event.end) }}
                </span>
              </p>

              <p class="mb-2">
                <i class="bi bi-clock me-2"></i>
                {{ product.event.startTime }}
              </p>

              <p class="mb-2">
                <i class="bi bi-geo-alt me-2"></i>
                {{ product.event.location.name }}
              </p>
              {{ product.description }}

              <!-- Address Tag -->

              <div class="card shadow-sm custom-card-mobile mt-3 d-block d-md-none">
                <!-- Price -->
                <div class="d-flex justify-content-between align-items-center mb-3">
                  <span class="text-muted fw-medium">Price</span>
                  <p>
                    {{ getTicketPriceRange(product.event.tickets) }}
                  </p>
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
            <div class="pt-2" v-if="product.user && product.user.brand">
              <p class="mb-2">
                posted by
                <i class="bi bi-person-circle me-2"></i>
                {{ product.user.brand }}
              </p>
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
            <div
              v-if="product && product.event"
              class="d-flex justify-content-between align-items-center mb-3"
            >
              <span class="text-muted fw-medium">Price</span>
              <span class="fw-bold fs-5">
                {{ getTicketPriceRange(product.event.tickets) }}
              </span>
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
        <div class="col-md-4 pt-3 pt-md-0" v-for="product in products" :key="product._id">
          <div>
            <img
              :src="
                product.photos[0] || 'https://via.placeholder.com/400x300?text=No+Image'
              "
              class="img-fluid rounded w-100"
              style="height: 200px; object-fit: cover"
              width="400"
              height="200"
              :alt="product.title + ' related event'"
              loading="lazy"
              decoding="async"
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
              <button class="btn btn-outline-primary" @click="goToProduct(product.title)">
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
    props: ["title"],
    product: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      affiliateCode: null,
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
      const productSlug = this.$route.params.title;
      console.log(productSlug);

      const response = await axios.get(
        `https://event-ticket-backend-yx81.onrender.com/api/product/${productSlug}`
      );

      this.product = response.data.product || {};
      console.log(this.product);
    } catch (error) {
      console.error("Error fetching product details:", error);
    }

    try {
      const response = await axios.get(
        `https://event-ticket-backend-yx81.onrender.com/api/products`
      );
      console.log("API Response:", response.data);

      this.products = this.shuffleArray(response.data.products || []).slice(0, 3);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  },
  metaInfo() {
    if (!this.product || !this.product.title) {
      return {
        title: "234africa - Event Ticketing Platform",
        meta: [
          { property: "og:title", content: "234africa - Event Ticketing Platform" },
          { property: "og:description", content: "Discover and book amazing events across Africa" },
          { property: "og:type", content: "website" },
          { property: "og:site_name", content: "234africa" },
        ],
      };
    }

    const eventTitle = this.product.title || "Event";
    const eventDescription = this.product.description || "Join us for this amazing event!";
    const eventImage = this.product.photos && this.product.photos[0] 
      ? this.product.photos[0] 
      : "https://via.placeholder.com/1200x630?text=234africa+Event";
    const eventUrl = `https://234tickets.live/event/${this.$route.params.title}`;
    
    const eventDate = this.product.event && this.product.event.start 
      ? this.formatDate(this.product.event.start) 
      : "";
    const eventLocation = this.product.event && this.product.event.location 
      ? this.product.event.location.name 
      : "";
    const priceRange = this.product.event && this.product.event.tickets 
      ? this.getTicketPriceRange(this.product.event.tickets) 
      : "";

    return {
      title: `${eventTitle} | 234africa`,
      meta: [
        { property: "og:title", content: eventTitle },
        { property: "og:description", content: eventDescription },
        { property: "og:image", content: eventImage },
        { property: "og:url", content: eventUrl },
        { property: "og:type", content: "event" },
        { property: "og:site_name", content: "234africa" },
        
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: eventTitle },
        { name: "twitter:description", content: eventDescription },
        { name: "twitter:image", content: eventImage },
        
        { name: "description", content: eventDescription },
        
        ...(eventDate ? [{ property: "event:start_time", content: this.product.event.start }] : []),
        ...(eventLocation ? [{ property: "event:location", content: eventLocation }] : []),
      ],
    };
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
    formatPrice(price, currency = "NGN") {
      if (!price || price === 0) return "Free";
      return `${this.getCurrencySymbol(currency)}${price}`;
    },
    slugify(text) {
      return text
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-") // Replace spaces with hyphens
        .replace(/[^\w\s'-]/g, ""); // Remove special characters, keep apostrophes
    },
    goToProduct(productTitle) {
      const normalizedProductTitle = productTitle.replace(/\s+/g, "-").toLowerCase();

      // Open in new tab
      window.open(`/event/${normalizedProductTitle}`, "_blank");
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
  mounted() {
    const query = this.$route.query;
    const aff = query.aff || query.Aff || query.AFF; // handle different cases

    console.log(aff);

    if (aff) {
      this.affiliateCode = aff;
      localStorage.setItem("affiliateCode", aff); // Save for later use
    } else {
      this.affiliateCode = null;
      localStorage.removeItem("affiliateCode"); // Clear if no aff in URL
    }
  },
};
</script>

<style scoped>
.product-page {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  min-height: 100vh;
  padding-bottom: 3rem;
}

.background-wrapper {
  position: relative;
  margin-bottom: 2rem;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15);
  animation: fadeIn 0.6s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.background-wrapper img {
  width: 100%;
  height: 400px;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.background-wrapper:hover img {
  transform: scale(1.03);
}

.container {
  max-width: 1200px;
}

h2.fw-bold {
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 1.5rem;
  font-weight: 800;
  line-height: 1.2;
}

.mt-3 p {
  font-size: 1.1rem;
  color: #555;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  transition: color 0.3s ease;
}

.mt-3 p:hover {
  color: #228B22;
}

.mt-3 p i {
  color: #228B22;
  font-size: 1.3rem;
  margin-right: 0.75rem;
  min-width: 24px;
}

hr {
  border: none;
  height: 2px;
  background: linear-gradient(90deg, #228B22 0%, transparent 100%);
  margin: 2rem 0;
}

.tag-badge {
  display: inline-block;
  background: linear-gradient(135deg, #228B22 0%, #047143 100%);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 600;
  margin-right: 0.5rem;
  margin-bottom: 0.5rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 10px rgba(34, 139, 34, 0.2);
}

.tag-badge:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 16px rgba(34, 139, 34, 0.3);
}

h5.fw-bold {
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 1rem;
  font-weight: 700;
}

.custom-card,
.custom-card-mobile {
  background: white;
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(0, 0, 0, 0.05);
  transition: all 0.4s ease;
}

.custom-card {
  position: sticky;
  top: 20px;
  z-index: 1020;
  width: 85%;
  height: fit-content;
}

.custom-card-mobile {
  position: sticky;
  top: 0;
  z-index: 1020;
  width: 100%;
  padding: 1.5rem;
}

.custom-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.15);
}

.text-muted.fw-medium {
  color: #666 !important;
  font-size: 1rem;
  font-weight: 600;
}

.fw-bold.fs-5 {
  color: #228B22;
  font-size: 1.75rem !important;
  font-weight: 800;
}

.btn-primary {
  background: linear-gradient(135deg, #228B22 0%, #047143 100%);
  border: none;
  padding: 1rem 2rem;
  font-size: 1.1rem;
  font-weight: 700;
  border-radius: 12px;
  transition: all 0.3s ease;
  box-shadow: 0 6px 20px rgba(34, 139, 34, 0.3);
  color: white !important;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.btn-primary:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 30px rgba(34, 139, 34, 0.4);
  background: linear-gradient(135deg, #047143 0%, #228B22 100%);
}

.btn-outline-primary {
  border: 2px solid #228B22;
  color: #228B22;
  background: white;
  padding: 0.75rem 1.5rem;
  font-weight: 600;
  border-radius: 10px;
  transition: all 0.3s ease;
}

.btn-outline-primary:hover {
  background: linear-gradient(135deg, #228B22 0%, #047143 100%);
  color: white;
  border-color: #228B22;
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(34, 139, 34, 0.3);
}

h1.fw-bold {
  font-size: 2rem;
  color: #333;
  margin-top: 3rem;
  margin-bottom: 2rem;
  font-weight: 800;
  position: relative;
  padding-bottom: 1rem;
}

h1.fw-bold::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 80px;
  height: 4px;
  background: linear-gradient(90deg, #228B22 0%, #DC143C 100%);
  border-radius: 2px;
}

.col-md-4 {
  margin-bottom: 2rem;
}

.img-fluid.rounded {
  border-radius: 16px !important;
  transition: all 0.4s ease;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
}

.img-fluid.rounded:hover {
  transform: scale(1.05);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.2);
}

.pt-2 h5 {
  font-size: 1.3rem;
  font-weight: 700;
  color: #333;
  margin-top: 1rem;
  margin-bottom: 0.75rem;
  transition: color 0.3s ease;
}

.pt-2 h5:hover {
  color: #228B22;
}

.pt-2 p {
  color: #666;
  font-size: 1rem;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
}

.pt-2 p i {
  color: #228B22;
  margin-right: 0.5rem;
  font-size: 1.1rem;
}

.d-flex.flex-wrap.gap-2 {
  gap: 0.75rem !important;
}

.bi-person-circle {
  color: #DC143C;
  font-size: 1.2rem;
}

@media (max-width: 768px) {
  .background-wrapper img {
    height: 250px;
  }

  h2.fw-bold {
    font-size: 1.8rem;
  }

  .mt-3 p {
    font-size: 1rem;
  }

  .custom-card {
    width: 100%;
    position: relative;
    top: 0;
  }

  .custom-card-mobile {
    padding: 1.25rem;
  }

  h1.fw-bold {
    font-size: 1.5rem;
  }

  .pt-2 h5 {
    font-size: 1.1rem;
  }

  .btn-primary {
    font-size: 1rem;
    padding: 0.875rem 1.5rem;
  }
}

@media (max-width: 576px) {
  .background-wrapper img {
    height: 200px;
  }

  h2.fw-bold {
    font-size: 1.5rem;
  }

  .tag-badge {
    font-size: 0.8rem;
    padding: 0.4rem 0.8rem;
  }

  .custom-card,
  .custom-card-mobile {
    padding: 1rem;
  }

  .fw-bold.fs-5 {
    font-size: 1.4rem !important;
  }
}

@media (min-width: 769px) {
  .custom-card {
    display: block !important;
  }
}

@media (max-width: 768px) {
  .custom-card-mobile {
    display: block !important;
  }
}
</style>
