<template>
  <div class="">
    <div class="padding-global">
      <div
        style="
          background-image: url('/IMG_0305.PNG');
          background-size: cover;
          position: relative;
          background-position: center;
          height: fit-content;
          overflow: hidden;
        "
      >
        <div
          style="
            position: absolute;
            inset: 0;
            background-color: rgba(0, 0, 0, 0.6); /* adjust opacity here */
            z-index: 1;
          "
        ></div>
        <div class="container-large" style="">
          <div class="home-hero_content text-start">
            <div
              class="home-hero_content-col-left"
              style="
                position: relative;
                z-index: 2;
                color: white;
                padding: 2rem;
              "
            >
              <div class="max-width-medium pt-md-4 pt-1">
                <h1 class="text-white pt-md-5 pt-0">
                  Discover Events. Book Instantly
                </h1>
              </div>
              <div class="padding-bottom padding-small">
                <div class="padding-bottom padding-xxsmall"></div>
              </div>
              <p>
                From live concerts to family festivals — get tickets to
                unforgettable experiences around you.
              </p>
              <div class="padding-bottom padding-custom2"></div>
              <div class="home-hero_button-group">
                <router-link
                  class="button text-decoration-none btn-primary btn-primary:hover"
                  to="/dash"
                  >Host an event</router-link
                >
                <router-link
                  class="button is-secondary text-decoration-none is-white w-button"
                  to="/events"
                  >Find Events</router-link
                >
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="container pt-4">
      <div class="overflow-auto">
        <div
          v-if="categories.length"
          class="d-flex flex-nowrap text-center justify-content-between gap-4"
        >
          <!-- Music -->
          <div
            v-for="category in categories"
            :key="category._id"
            class="flex-shrink-0"
          >
            <div
              class="border rounded-circle icon-box p-4 d-flex align-items-center justify-content-center mx-auto"
              style="width: 80px; height: 80px"
              @click="goToCategory(category.type)"
            >
              <img
                :src="category.photo"
                alt="Category SVG"
                width="40"
                height="40"
              />
            </div>
            <p class="mt-2 mb-0">{{ category.type }}</p>
          </div>
        </div>
        <p v-else>No categories found.</p>
      </div>
    </div>
    <div class="container py-5">
      <div class="row text-start">
        <!-- Left Side -->
        <div class="col-md-6 mb-4 mb-md-0">
          <h1 class="fw-bold display-4">
            There is <br />
            something here <br />
            for everyone
          </h1>
        </div>

        <!-- Right Side - Text at bottom -->
        <div class="col-md-6 d-flex flex-column justify-content-end text-start">
          <small>
            From dance parties to power talks, there's something for
            everyone.<br />
            We make it easy for you to find events that match your vibe.
          </small>
        </div>
      </div>
    </div>

    <div class="container pt-4 text-start py-4">
      <h3 class="mb-3">Trending Events</h3>

      <div class="row">
        <!-- Card 1 -->
        <div
          class="col-md-4"
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
              <div>
                <h5>{{ product.title }}</h5>

                <p class="mb-1">
                  <i class="bi bi-calendar-event me-2"></i>
                   {{ formatDate(product.event.start)  }} - {{ formatDate(product.event.end)  }}
                </p>
                <p class="mb-1">
                  <i class="bi bi-clock me-2"></i>
                     {{ product.event.startTime }} -
                {{ product.event.endTime }}
                </p>
                 
                <p class="mb-1">
                  <i class="bi bi-geo-alt me-2"></i>
                   {{ product.event.location.name || "No location" }}
                </p>
               
                <p>{{ formatPrice(product.price) }}</p>
              </div>

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
    </div>
    <div class="container">
      <div class="row align-items-center text-start pt-5">
        <!-- Text Section -->
        <div class="col-lg-6 mb-4 mb-lg-0">
          <h1 class="fw-bold mb-3">About Us</h1>
          <p class="fs-6 text-muted mb-4">
            Welcome to 234 AFRICA, your premier event ticketing platform
            dedicated to connecting people with unforgettable experiences across
            Africa.
          </p>
          <p class="fs-6 text-muted">
            Our platform connects event organizers and attendees in a seamless
            way, giving you real-time access to tickets, event details, and
            more.
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

      <div class="row align-items-center py-5 text-start">
        <!-- SVG Illustration -->
        <div class="col-md-6 text-center mt-4 mt-md-0">
          <img
            src="/undraw_data-reports_l2u3.svg"
            class="img-fluid"
            alt="Manage Events Illustration"
          />
        </div>
        <!-- Text Content -->
        <div class="col-md-6">
          <h3 class="fw-bold mb-3">Manage Your Events Easily</h3>
          <p class="text-muted">
            From planning to promotion, get everything done in one place.
          </p>
          <ul class="list-unstyled text-muted">
            <li class="mb-2">
              <i class="bi bi-check-circle-fill me-2" style="color: #429371"></i
              >Create and publish events in minutes
            </li>
            <li class="mb-2">
              <i class="bi bi-check-circle-fill me-2" style="color: #429371"></i
              >Monitor sales and check-ins in real-time
            </li>
            <li class="mb-2">
              <i class="bi bi-check-circle-fill me-2" style="color: #429371"></i
              >Integrated tools for marketing and payments
            </li>
          </ul>
          <a
            href="features-create.html"
            class="btn btn-primary btn-primary:hover mt-3"
            >Create Event</a
          >
        </div>
      </div>

      <section class="">
        <div class="row g-4">
          <!-- Active Support -->
          <section class="container py-5">
            <div class="row align-items-center text-start">
              <!-- SVG Illustration -->

              <!-- Text Content -->
              <div class="col-md-6">
                <h3 class="fw-bold mb-3">24/7 Live Support</h3>
                <ul class="list-unstyled text-muted">
                  <li class="mb-2">
                    <i
                      class="bi bi-check-circle-fill me-2"
                      style="color: #429371"
                    ></i
                    >Real-time chat and email assistance
                  </li>
                  <li class="mb-2">
                    <i
                      class="bi bi-check-circle-fill me-2"
                      style="color: #429371"
                    ></i
                    >Dedicated event setup specialists
                  </li>
                  <li class="mb-2">
                    <i
                      class="bi bi-check-circle-fill me-2"
                      style="color: #429371"
                    ></i
                    >On-demand troubleshooting and escalation
                  </li>
                  <li class="mb-2">
                    <i
                      class="bi bi-check-circle-fill me-2"
                      style="color: #429371"
                    ></i
                    >Help center with detailed guides and FAQs
                  </li>
                  <li class="mb-2">
                    <i
                      class="bi bi-check-circle-fill me-2"
                      style="color: #429371"
                    ></i
                    >Support in multiple languages
                  </li>
                </ul>
                <a
                  href="#"
                  class="btn btn-primary btn-primary:hover mt-3 mb-3"
                  style="color: #429371"
                  >Get Help Now</a
                >
              </div>
              <div class="col-md-6 mb-4 mb-md-0 text-center">
                <img
                  src="/undraw_active-support_v6g0.svg"
                  class="img-fluid"
                  alt="Live Support"
                />
              </div>
            </div>
          </section>
        </div>
      </section>
    </div>
    <div class="container text-center py-5">
      <h2 class="fw-bold">Pricing</h2>
      <p class="text-muted">No hidden fees. Only pay when you sell tickets.</p>

      <div class="bg-light rounded-3 p-4 my-4 mx-auto" style="max-width: 400px">
        <div class="fs-4 fw-semibold">
          7.5% + <span class="fw-bold">₦100</span>
        </div>
        <div class="text-muted">per paid ticket</div>
      </div>

      <p class="text-success fw-medium">
        Free tickets? <span class="fw-bold">No charge at all!</span>
      </p>
    </div>
  </div>
</template>
<style></style>

<script>
import axios from "axios";

export default {
  name: "CategoriesList",
  data() {
    return {
      categories: [],
      products: [],
    };
  },
  mounted() {
    this.fetchCategories();
    this.fetchProducts();
  },
  methods: {
    goToCategory(categoryType) {
      // Replace spaces with hyphens and trim any leading/trailing spaces
      const formattedCategory = categoryType.replace(/\s+/g, "-").trim();

      // Use the formatted category name in the URL
      this.$router.push(`/categories/${formattedCategory}`);
    },
    async fetchCategories() {
      try {
        const response = await axios.get(
          "https://event-ticket-qa70.onrender.com/api/categories"
        );
        if (response.data.status) {
          this.categories = response.data.categories;
        }
        console.log("Categories fetched:", this.categories);
      } catch (error) {
        console.error("Error fetching categories:", error.message);
      }
    },
    async fetchProducts() {
      try {
        const res = await axios.get("https://event-ticket-qa70.onrender.com/api/products");
        const allProducts = res.data.products;

        // Shuffle the array
        const shuffled = allProducts.sort(() => Math.random() - 0.5);

        // Limit to 3 products
        this.products = shuffled.slice(0, 3);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
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
    },
    formatDate(date) {
      if (!date) return "No date";
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
  },
};
</script>
