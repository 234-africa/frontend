// store/reviews.js

//import axios from "axios";
import axiosInstance from "@/helpers/axiosInstance";

const state = {
  reviews: [],

};

const mutations = {
  SET_REVIEWS(state, reviews) {
    state.reviews = reviews;
  },

};

const actions = {
  async fetchProductReviews({
    commit
  }, productID) {
    try {
      const response = await axiosInstance.get(`/reviews/${productID}`);
      const {
        reviews
      } = response.data;
      commit("SET_REVIEWS", reviews);
    } catch (error) {
      console.error(error);
    }
  },
  async onAddReview({
    commit
  }, reviewData) {
    try {

      const response = await axiosInstance.post(
        `/reviews/${reviewData.productId}`,
        reviewData.review,

      );

      if (response) {
        // Handle the response as needed
        // For example, commit a mutation or trigger another action
        commit("reviewAdded", response.data);
      }
    } catch (err) {
      // Handle error
      console.log(err);
    }
  },
  async fetchReviews({
    commit
  }) {
    try {
      const response = await axiosInstance.get("/reviews");
      const reviews = response.data.reviews;
      commit("SET_REVIEWS", reviews);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  }
};

const getters = {
  getReviews(state) {
    return state.reviews;
  },


};

export default {
  // namespaced: true,
  state,
  mutations,
  actions,
  getters
};