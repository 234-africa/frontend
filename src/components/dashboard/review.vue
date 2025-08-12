<template>
  <div class="content-bod">
    <!-- row -->
    <div class="container-flid">
      <div class="form-head d-flex mb-3 mb-md-4 align-items-start">
        <div class="mr-auto d-none d-lg-block">
          <h2 class="text-black font-w600 mb-1">Reviews</h2>
          <ol class="breadcrumb">
            <li class="breadcrumb-item"><a
                href="javascript:void(0)"
                class="text-primary"
              >Dashboard</a></li>
            <li class="breadcrumb-item active"><a href="javascript:void(0)">Customer Reviews</a></li>
          </ol>
        </div>
        <div class="dropdown custom-dropdown">
          <div
            class="btn btn-sm btn-primary light d-flex align-items-center svg-btn"
            data-toggle="dropdown"
          >
            <svg
              width="28"
              height="28"
              viewBox="0 0 28 28"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g>
                <path
                  d="M22.4281 2.856H21.8681V1.428C21.8681 0.56 21.2801 0 20.4401 0C19.6001 0 19.0121 0.56 19.0121 1.428V2.856H9.71606V1.428C9.71606 0.56 9.15606 0 8.28806 0C7.42006 0 6.86006 0.56 6.86006 1.428V2.856H5.57206C2.85606 2.856 0.560059 5.152 0.560059 7.868V23.016C0.560059 25.732 2.85606 28.028 5.57206 28.028H22.4281C25.1441 28.028 27.4401 25.732 27.4401 23.016V7.868C27.4401 5.152 25.1441 2.856 22.4281 2.856ZM5.57206 5.712H22.4281C23.5761 5.712 24.5841 6.72 24.5841 7.868V9.856H3.41606V7.868C3.41606 6.72 4.42406 5.712 5.57206 5.712ZM22.4281 25.144H5.57206C4.42406 25.144 3.41606 24.136 3.41606 22.988V12.712H24.5561V22.988C24.5841 24.136 23.5761 25.144 22.4281 25.144Z"
                  fill="#f4a213"
                ></path>
              </g>
            </svg>
            <div class="text-left ml-3">
              <span class="d-block fs-16">Filter Periode</span>
              <small class="d-block fs-13">4 June 2020 - 4 July 2020</small>
            </div>
            <i class="fa fa-angle-down scale5 ml-3"></i>
          </div>
          <div class="dropdown-menu dropdown-menu-right">
            <a
              class="dropdown-item"
              href="#"
            >4 June 2020 - 4 July 2020</a>
            <a
              class="dropdown-item"
              href="#"
            >5 july 2020 - 4 Aug 2020</a>
          </div>
        </div>
      </div>
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
                    href="#"
                  >Latest</a>
                  <a
                    class="dropdown-item"
                    href="#"
                  >OLD</a>
                </div>
              </div>
            </div>
            <div class="card-body p-0">
              <div class="media review-box">
                <img
                  class="mr-3 img-fluid btn-rounded"
                  width="55"
                  src="frontend/images/avatar/1.jpg"
                  alt="DexignZone"
                >
                <div class="media-body">
                  <h4 class="mt-0 mb-0 text-black">Glee Smiley</h4>
                  <ul class="review-meta mb-3 d-block d-sm-flex align-items-center">
                    <li class="mr-3"><small>Head Marketing</small></li>
                    <li class="mr-3"><small>24 June 2020</small></li>
                    <li class="ml-auto"><span class="badge badge-rounded badge-warning light font-w500">Excelent</span></li>
                  </ul>
                  <p class="mb-3 text-secondary">We recently had dinner with friends at David CC and we all walked away with a great experience. Good food, pleasant environment, personal attention through all the evening. Thanks to the team and we will be back!</p>
                </div>
                <div class="media-footer align-self-center">
                  <div class="star-review text-md-center">
                    <span class="text-secondary">4.5</span>
                    <i class="fa fa-star text-primary"></i>
                    <i class="fa fa-star text-primary"></i>
                    <i class="fa fa-star text-primary"></i>
                    <i class="fa fa-star text-primary"></i>
                    <i class="fa fa-star text-gray"></i>
                  </div>
                </div>
              </div>

            </div>
            <div class="card-footer border-0 text-center py-4">
              <a
                href="#"
                class="btn btn-primary"
              >Re More <i class="fa fa-angle-double-down scale2 ml-2"></i></a>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {

  computed: {
    ...mapGetters(["getReviews"]),
    reviews() {
      return this.getReviews;
    },

  },
  mounted() {
    this.fetchReviews();
  },
  methods: {
    ...mapActions(["fetchReviews"])
  }
};
</script>
