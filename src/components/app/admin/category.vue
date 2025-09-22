<template>
  <div class="container py-4">

    <!-- Create Category Form -->
    <div class="card p-4 shadow-sm mb-4">
      <h4 class="mb-3">Create Category</h4>
      <form @submit.prevent="createCategory" enctype="multipart/form-data">
        <div class="mb-3">
          <input 
            v-model="newCategory.type" 
            placeholder="Category Type" 
            required 
            class="form-control"
          />
        </div>
        <div class="mb-3">
          <input 
            type="file" 
            @change="handleFileChange" 
            class="form-control"
          />
        </div>
        <button type="submit" class="btn btn-success">Create Category</button>
      </form>
    </div>

    <!-- Edit Category (moved up) -->
    <div v-if="editingCategory" class="card p-4 shadow-sm mb-4">
      <h4 class="mb-3">Edit Category</h4>
      <form @submit.prevent="updateCategory" enctype="multipart/form-data">
        <div class="mb-3">
          <input 
            v-model="editingCategory.type" 
            placeholder="Category Type" 
            class="form-control"
          />
        </div>
        <div class="mb-3">
          <input 
            type="file" 
            @change="handleEditFileChange" 
            class="form-control"
          />
        </div>
        <button type="submit" class="btn btn-primary">Update</button>
        <button type="button" @click="editingCategory = null" class="btn btn-secondary ms-2">
          Cancel
        </button>
      </form>
    </div>

    <!-- List All Categories -->
    <div class="mb-4">
      <h2 class="mb-3">All Categories</h2>
      <div v-if="categories.length" class="row g-3">
        <div 
          v-for="cat in categories" 
          :key="cat._id" 
          class="col-md-4"
        >
          <div class="card h-100 shadow-sm">
            <div class="card-body text-center">
              <p class="fw-bold">{{ cat.type }}</p>
              <img 
                v-if="cat.photo" 
                :src="cat.photo" 
                class="img-fluid rounded mb-2"
                style="max-height: 150px; object-fit: cover;"
              />
              <div class="d-flex justify-content-center gap-2 mt-2">
                
                <button @click="editCategory(cat)" class="btn btn-outline-warning btn-sm">
                  Edit
                </button>
                <button @click="deleteCategory(cat._id)" class="btn btn-outline-danger btn-sm">
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="alert alert-info">No categories found.</div>
    </div>

    <!-- View Single Category -->
  

    <!-- Spinner -->
    <spinner v-if="spinner" class="mt-3" />
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
       this.spinner = true
   
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
      );

      this.editingCategory = null;
      this.editingFile = null;
       this.spinner = false
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
