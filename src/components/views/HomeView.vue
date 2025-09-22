<template>
  <div class="">
    <main class="bg-white">
      <div
        data-w-id="31acb4c1-f0e5-8cc0-86b5-4ceb0cb347ef"
        class="page-scroll-trigger"
      ></div>

     
    
      
      <div class="container pt-4 text-start py-4">
        <h3 class="mb-3">Upcoming events</h3>

        <div class="row">
          <!-- Card 1 -->
          <div class="col-md-4">
            <img
              src="https___cdn.evbuc.com_images_782641929_1970074830183_1_original.avif"
              class="img-fluid rounded"
              alt="Event 1"
            />
            <div class="pt-3">
              <h5>Card title</h5>
              <p>Some quick example text to build on the card</p>
              <p class="fw-bold">$30</p>
            </div>
          </div>

          <!-- Card 2 -->
          <div class="col-md-4">
            <img
              src="https___cdn.evbuc.com_images_782641929_1970074830183_1_original.avif"
              class="img-fluid rounded"
              alt="Event 2"
            />
            <div class="pt-3">
              <h5>Card title</h5>
              <p>Some quick example text to build on the card</p>
              <p class="fw-bold">$30</p>
            </div>
          </div>

          <!-- Card 3 -->
          <div class="col-md-4">
            <img
              src="https___cdn.evbuc.com_images_1063236693_2815039803521_1_original.avif"
              class="img-fluid rounded"
              alt="Event 3"
            />
            <div class="pt-3">
              <h5>Card title</h5>
              <p>Some quick example text to build on the card</p>
              <p class="fw-bold">$30</p>
            </div>
          </div>
        </div>
        <div class="row">
          <!-- Card 1 -->
          <div class="col-md-4">
            <img
              src="https___cdn.evbuc.com_images_1063236693_2815039803521_1_original.avif"
              class="img-fluid rounded"
              alt="Event 1"
            />
            <div class="pt-3">
              <h5>Card title</h5>
              <p>Some quick example text to build on the card</p>
              <p class="fw-bold">$30</p>
            </div>
          </div>

          <!-- Card 2 -->
          <div class="col-md-4">
            <img
              src="https___cdn.evbuc.com_images_782641929_1970074830183_1_original.avif"
              class="img-fluid rounded"
              alt="Event 2"
            />
            <div class="pt-3">
              <h5>Card title</h5>
              <p>Some quick example text to build on the card</p>
              <p class="fw-bold">$30</p>
            </div>
          </div>

          <!-- Card 3 -->
          <div class="col-md-4">
            <img
              src="https___cdn.evbuc.com_images_1063236693_2815039803521_1_original.avif"
              class="img-fluid rounded"
              alt="Event 3"
            />
            <div class="pt-3">
              <h5>Card title</h5>
              <p>Some quick example text to build on the card</p>
              <p class="fw-bold">$30</p>
            </div>
          </div>
        </div>
      </div>
      <div class="container pt-4 text-start py-4">
        <h3 class="mb-3">Events under 30</h3>

        <div class="row">
          <!-- Card 1 -->
          <div class="col-md-4">
            <img
              src="https___cdn.evbuc.com_images_782641929_1970074830183_1_original.avif"
              class="img-fluid rounded"
              alt="Event 1"
            />
            <div class="pt-3">
              <h5>Card title</h5>
              <p>Some quick example text to build on the card</p>
              <p class="fw-bold">$30</p>
            </div>
          </div>

          <!-- Card 2 -->
          <div class="col-md-4">
            <img
              src="https___cdn.evbuc.com_images_782641929_1970074830183_1_original.avif"
              class="img-fluid rounded"
              alt="Event 2"
            />
            <div class="pt-3">
              <h5>Card title</h5>
              <p>Some quick example text to build on the card</p>
              <p class="fw-bold">$30</p>
            </div>
          </div>

          <!-- Card 3 -->
          <div class="col-md-4">
            <img
              src="https___cdn.evbuc.com_images_1063236693_2815039803521_1_original.avif"
              class="img-fluid rounded"
              alt="Event 3"
            />
            <div class="pt-3">
              <h5>Card title</h5>
              <p>Some quick example text to build on the card</p>
              <p class="fw-bold">$30</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import axios from "axios";

import { mapGetters, mapActions } from "vuex";

export default {
  data() {
    return {
      products: [],
      product: {},
      isLiked: false,
    };
  },
  computed: {
    ...mapGetters(["getProducts"]),
    products() {
      return this.getProducts;
    },
  },
  mounted() {
    this.$store.dispatch("fetchProducts");
  },
  methods: {
    // Import the required action

    onLikeProduct(productId) {
      // Import the required action and useNotification function

      this.likeProducts(productId) // Dispatch the action with the productId
        .then((res) => {
          this.isLiked = true; // Update the isLiked state after successful like
          // console.log(`Liked product with ID: ${productId}`);
          if (res.status === "success") {
            console.this.$notify({
              title: "Liked",
              message: `Liked product with ID: ${productId}`,
              type: "success",
            });
          }
        })
        .catch((error) => {});
    },
    ...mapActions(["incrementViews", "likeProducts"]),
    handleClick(productId) {
      this.incrementViews(productId);
    },
  },
};
</script>

<style>
.icon-box {
  transition: background-color 0.3s ease;
}

.icon-box:hover {
  background-color: #e6f4ea; /* Light green background */
}

.icon-box:hover i {
  color: #198754; /* Bootstrap's green */
}

.icon-box i {
  color: inherit;
  transition: color 0.3s ease;
}

.card {
  border-radius: 16px;
}
</style>
