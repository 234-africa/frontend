<template>
  <div class="search_bar dropdown show">
    <div class="dropdown-menu p-0 m-0 show">
      <form @submit.prevent="performSearch">
        <input
          class="form-control"
          v-model="searchQuery"
          type="search"
          placeholder="Search Here"
          aria-label="Search"
          @keyup.enter="performSearch"
        >
      </form>
    </div>
    <span
      class="search_icon p-3 c-pointer"
      data-toggle="dropdown"
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M23.7871 22.7761L17.9548 16.9437C19.5193 15.145 20.4665 12.7982 20.4665 10.2333C20.4665 4.58714 15.8741 0 10.2333 0C4.58714 0 0 4.59246 0 10.2333C0 15.8741 4.59246 20.4665 10.2333 20.4665C12.7982 20.4665 15.145 19.5193 16.9437 17.9548L22.7761 23.7871C22.9144 23.9255 23.1007 24 23.2816 24C23.4625 24 23.6488 23.9308 23.7871 23.7871C24.0639 23.5104 24.0639 23.0528 23.7871 22.7761ZM1.43149 10.2333C1.43149 5.38004 5.38004 1.43681 10.2279 1.43681C15.0812 1.43681 19.0244 5.38537 19.0244 10.2333C19.0244 15.0812 15.0812 19.035 10.2279 19.035C5.38004 19.035 1.43149 15.0865 1.43149 10.2333Z"
          fill="#A4A4A4"
        />
      </svg>
    </span>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      searchQuery: "",
      searchResults: [] // Initialize searchResults as an empty array
    };
  },
  methods: {
    async performSearch() {
      try {
        const response = await axios.post("https://event-ticket-qa70.onrender.com/api/search", {
          title: this.searchQuery
        });
       // console.log(response)
        this.$store.commit('setSearchResults', response.data);
      } catch (error) {
       // console.error("Search error:", error);
        // Handle the error in your component, e.g., show an error message
      }
    }
  }
};
</script>


<style scoped>
.product-card {
  border: 1px solid #ddd;
  padding: 12px;
  margin-bottom: 12px;
  border-radius: 6px;
}
</style>
