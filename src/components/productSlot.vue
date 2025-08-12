<template>
  <div>
    <router-link
      :to="`/review/${product._id}`"
      class="text-white"
    >
      <button class="btn btn-primary"> Add a review</button>

    </router-link>
    <reviewSection
      :product="product"
      :reviews="reviews"
    />
  </div>
</template>

<script>
import { mapActions } from "vuex";
import { mapGetters } from "vuex";
import axios from "axios";
import reviewSection from "../components/reviewSection.vue";
export default {
  components: {
    //slot,

    reviewSection
  },
  data() {
    return {
      categoryID: null,
      categories: [],
      products: [],
      show: null,
      price: null,
      product: null,
      reviews: null,
      rating: null,
      activeItem: "home"
    };
  },

  methods: {
    ...mapActions(["addProductToCart", "addProductToWatch"]),
    isActive(menuItem) {
      return this.activeItem === menuItem;
    },
    setActive(menuItem) {
      this.activeItem = menuItem;
    }
  },

  async mounted() {

    axios
      .get(`https://event-ticket-qa70.onrender.com/api/reviews/${this.$route.params.id}`, {})
      .then(response => {
        //  console.log(response);
        this.reviews = response.data.reviews;
      })
      .catch(error => {
        console.log(error);
      });
  }
};
</script>
