<template>
  <div class="container">
    <h1>Category Manager</h1>

    <!-- Create Category Form -->
    <form @submit.prevent="createCategory" enctype="multipart/form-data">
      <input v-model="newCategory.type" placeholder="Category Type" required />
      <input type="file" @change="handleFileChange" />
      <button type="submit">Create Category</button>
    </form>

    <hr />

    <!-- List All Categories -->
    <h2>All Categories</h2>
    <div v-if="categories.length">
      <div v-for="cat in categories" :key="cat._id" class="category-box">
        <p><strong>Type:</strong> {{ cat.type }}</p>
        <img v-if="cat.photo" :src="cat.photo" width="150" />
        <br />
        <button @click="getCategory(cat._id)">View</button>
        <button @click="editCategory(cat)">Edit</button>
        <button @click="deleteCategory(cat._id)">Delete</button>
      </div>
    </div>
    <div v-else>No categories found.</div>

    <hr />

    <!-- Edit Category -->
    <div v-if="editingCategory">
      <h2>Edit Category</h2>
      <form @submit.prevent="updateCategory" enctype="multipart/form-data">
        <input v-model="editingCategory.type" placeholder="Category Type" />
        <input type="file" @change="handleEditFileChange" />
        <button type="submit">Update</button>
        <button type="button" @click="editingCategory = null">Cancel</button>
      </form>
    </div>

    <!-- View Single Category -->
    <div v-if="singleCategory">
      <h2>Single Category</h2>
      <p><strong>Type:</strong> {{ singleCategory.type }}</p>
      <img :src="singleCategory.photo" width="150" />
    </div>
            <spinner v-if="spinner" />
  </div>
</template>

<script>

import spinner from "../../spinner.vue";
import axios from "axios";


export default {
    components: {
        spinner
    },
  data() {
    return {
      baseUrl: "https://event-ticket-qa70.onrender.com/api",
      categories: [],
      newCategory: { type: "", photo: null },
      editingCategory: null,
      spinner:false,
      selectedFile: null,
      editingFile: null,
      singleCategory: null,
    };
  },
  mounted() {
  
    this.fetchCategories();
  },
  methods: {
    async fetchCategories() {
      const res = await axios.get(`${this.baseUrl}/categories`);
      this.categories = res.data.categories;
    },
    handleFileChange(e) {
      this.selectedFile = e.target.files[0];
    },
    async createCategory() {
         this.spinner = true
      const formData = new FormData();
      formData.append("type", this.newCategory.type);
      if (this.selectedFile) {
        formData.append("photo", this.selectedFile);
      }

      await axios.post(`${this.baseUrl}/categories`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      
      this.newCategory = { type: "", photo: null };
      this.selectedFile = null;
       this.spinner = false;
      this.fetchCategories();

    },
    editCategory(cat) {
      this.editingCategory = { ...cat };
      this.editingFile = null;
    },
    handleEditFileChange(e) {
      this.editingFile = e.target.files[0];
    },
    async updateCategory() {
   
      const formData = new FormData();
      formData.append("type", this.editingCategory.type);
      if (this.editingFile) {
        formData.append("photo", this.editingFile);
      }

      await axios.put(
        `${this.baseUrl}/categories/${this.editingCategory._id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
        
        alert('categories updated')
      );

      this.editingCategory = null;
      this.editingFile = null;
      this.fetchCategories();
    },
    async deleteCategory(id) {
      
      await axios.delete(`${this.baseUrl}/categories/${id}`);
       alert('category deleted')
      this.fetchCategories();
    },
    async getCategory(id) {
      const res = await axios.get(`${this.baseUrl}/categories/${id}`);
      this.singleCategory = res.data.category;
    },
  },
};
</script>

<style scoped>
.container {
  padding: 20px;
  font-family: Arial;
}
.category-box {
  border: 1px solid #ccc;
  padding: 10px;
  margin-bottom: 10px;
}
</style>
