<template>
  <div>

    Reviews ({{ reviews.length }})

    <div
      v-for="review in reviews"
      :key="review._id"
      class="pt-3"
    >

      <div class="row">
        <div class="col-sm-3">

          {{review.user.name}}
          <br>

          <i
            class="fas fa-star"
            v-for="i in review.rating"
            :key="i"
          ></i>

        </div>

        <div class="col-sm-9">
          <div class="">

            {{ review.headline }}
          </div>
          <div class="pt-2">
            {{ review.body }}
          </div>
          <br>
          {{ review.time.replace(review.time.match(/(\.).*/g)[0], "").replace("T", " ")  }}
        </div>
        <hr>
      </div>
      <hr>
    </div>
    <div class="float-end">
      <router-link
        :to="`/review/${product._id}`"
        class="text-white"
      >

      </router-link>
    </div>



  </div>
</template>

<script>
import moment from "moment";
import axios from "axios";
export default {
  data() {
    return {
      name: ""
    };
  },

  mounted() {
    const token = localStorage.getItem("token");
  },
  props: ["product", "reviews"]
};
</script>

<style>
.fa-star {
  color: #ffd055;
}
</style>
