<template>
  <div class="content-boy">
    <!-- row -->
    <div class="container-fuid">

      <div class="row">

        <div class="col-lg-8 col-xl-9">
          <div class="card">
            <div class="card-header border-0 pb-0 d-sm-flex d-block">
              <div>
                <h4 class="card-title mb-1 fs-28 font-w600">Recent Review</h4>
                <p class="mb-0">Here is customer review about your restaurant </p>
              </div>
              <div class="dropdown">
                <button
                  type="button"
                  class="btn btn-primary dropdown-toggle light fs-14"
                  data-toggle="dropdown"
                  aria-expanded="false"
                >
                  Latest
                </button>
                <div class="dropdown-menu">
                  <a
                    class="dropdown-item"
                    @click="sortByNewest"
                  >Latest</a>
                  <a
                    class="dropdown-item"
                    @click="sortByOldest"
                  >OLD</a>
                </div>
              </div>
            </div>
            <div class="card-body p-0">
              <div
                class="media review-box"
                v-for="review in sortedReviews"
                :key="review.id"
              >
                <img
                  class="mr-3 img-fluid btn-rounded"
                  width="55"
                  src="frontend/images/avatar/1.jpg"
                  alt="DexignZone"
                >
                <div class="media-body">
                  <h4 class="mt-0 mb-0 text-black">{{review.user.name}}</h4>
                  <ul class="review-meta mb-3 d-block d-sm-flex align-items-center">
                    <li class=""><small>{{ review.formattedTime }}</small></li>
                    <li class="ml-auto"><span class="badge badge-rounded badge-warning light font-w500">
                        <div v-if="review.rating === 5">Excellent</div>
                        <div v-if="review.rating === 4">Very Good</div>
                        <div v-if="review.rating === 3">Good</div>
                        <div v-if="review.rating === 2">Fair</div>
                        <div v-if="review.rating === 1">Poor</div>
                      </span></li>
                  </ul>
                  <p class="mb-3 text-secondary">{{review.body}}</p>
                </div>
                <div class="media-footer d-flex align-self-center">
                  <div
                    v-for="star in 5"
                    class=""
                  >
                    <i
                      class="fa fa-star"
                      :class="{ 'text-orange': star <= review.rating }"
                      :key="star"
                    ></i>
                  </div>
                </div>
              </div>
            </div>
            <div class="card-footer border-0 text-center py-4">
              <a
                @click="showMoreReviews"
                v-if="showMoreButton"
                class="btn btn-primary"
              >Read More <i class="fa fa-angle-double-down scale2 ml-2"></i></a>
            </div>
          </div>
        </div>
        <div class="col-lg-4 col-xl-3">

        </div>
      </div>
    </div>
  </div>
</template>


<script>
import { mapGetters, mapActions } from "vuex";
import moment from "moment";

export default {
  computed: {
    ...mapGetters(["getReviews"]),
    formattedReviews() {
      return this.getReviews.map(review => ({
        ...review,
        formattedTime: this.formatTime(review.time)
      }));
    },
    sortedReviews() {
      return this.formattedReviews
        .slice(0, this.displayedCount)
        .sort((a, b) => {
          if (this.sortOrder === "newest") {
            return new Date(b.time) - new Date(a.time);
          } else {
            return new Date(a.time) - new Date(b.time);
          }
        });
    },
    showMoreButton() {
      return this.displayedCount < this.getReviews.length;
    }
  },
  data() {
    return {
      displayedCount: 2, // Initially display 2 reviews
      sortOrder: "newest" // Default sorting order is "newest"
    };
  },
  mounted() {
    this.fetchReviews();
  },
  methods: {
    ...mapActions(["fetchReviews"]),
    showMoreReviews() {
      this.displayedCount += 2; // Increase the displayed count by 2
    },
    sortByNewest() {
      this.sortOrder = "newest";
    },
    sortByOldest() {
      this.sortOrder = "oldest";
    },
    formatTime(time) {
      return moment(time).format("YYYY-MM-DD");
    }
  }
};
</script>
