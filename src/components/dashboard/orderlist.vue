<template>
  <div class="">
    <div>
      <div class="tabs pt-2 px-2">
        <button
          v-for="tab in tabs"
          :key="tab"
          @click="currentTab = tab"
          :class="{ active: currentTab === tab }"
        >
          {{ tab }}
        </button>
      </div>

      <div class="tab-content">
        <div v-if="currentTab === 'Affiliate'">
          <!-- Affiliate Content -->
          <div>
            <div class="">
              <!-- Create Affiliate Link -->

              <div class="">
                <div class="row justify-content-center">
                  <div class="col-12 col-sm-10 col-md-8 col-lg-6">
                    <form @submit.prevent="createAffiliate" class="mx-auto mb-4">
                      <!-- Product Selection -->
                      <div class="text-center mb-3 text-white">
                        <h5 class="m-0">Create Affiliate Link</h5>
                      </div>

                      <select
                        v-if="products.length > 0"
                        v-model="selectedProductId"
                        class="form-select"
                      >
                        <option value="" disabled>Select an event</option>
                        <option v-for="p in products" :key="p._id" :value="p._id">
                          {{ p.title }}
                        </option>
                      </select>

                      <!-- Affiliate Name -->
                      <div class="mb-3">
                        <label for="affiliateName" class="form-label"
                          >Affiliate Name:</label
                        >
                        <input
                          type="text"
                          class="form-control"
                          id="affiliateName"
                          placeholder="Enter name"
                          v-model="affiliateName"
                          required
                        />
                      </div>

                      <!-- Affiliate Code -->
                      <div class="mb-3">
                        <label for="affiliateCode" class="form-label"
                          >Affiliate Code:</label
                        >
                        <input
                          type="text"
                          class="form-control"
                          id="affiliateCode"
                          placeholder="Enter code"
                          v-model="affiliateCode"
                          required
                        />
                      </div>

                      <!-- Generate Link Button -->
                      <div class="d-grid justify-content-center">
                        <button type="submit" class="btn btn-sm btn-primary">
                          Generate Affiliate Link
                        </button>
                      </div>
                    </form>

                    <!-- Display Generated Link -->
                    <div v-if="affiliateLink" class="alert alert-info mt-3">
                      <strong>Affiliate Link:</strong>
                      <a :href="affiliateLink" target="_blank">{{ affiliateLink }}</a>
                    </div>
                  </div>
                </div>
              </div>

              <div class="container my-4">
                <h2 class="mb-4 text-center">Affiliates</h2>

                <!-- 🔎 Search -->
                <div class="mb-3">
                  <input
                    type="text"
                    class="form-control w-50"
                    v-model="searchQuery"
                    placeholder="Search by Code or Name"
                  />
                </div>

                <!-- My Affiliates -->
                <div class="card mb-4 shadow-sm">
                  <div class="text-center bg-success p-2 text-white">
                    <h5 class="mb-0 text-center">My Affiliates</h5>
                  </div>
                  <div class="card-body p-0">
                    <div class="table-responsive">
                      <table class="table table-striped mb-0">
                        <thead>
                          <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Code</th>
                            <th>Link</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr v-if="!filterAffiliates.length">
                            <td colspan="4" class="text-center text-muted">
                              No affiliates found
                            </td>
                          </tr>
                          <tr
                            v-for="affiliate in paginatedAffiliates"
                            :key="affiliate._id"
                          >
                            <td>{{ affiliate._id }}</td>
                            <td>{{ affiliate.name }}</td>
                            <td>{{ affiliate.code }}</td>
                            <td>{{ affiliate.link }}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                <!-- Pagination -->
                <div class="d-flex justify-content-center mb-4">
                  <button
                    class="btn btn-outline-secondary me-2"
                    :disabled="currentPage === 1"
                    @click="prevPage"
                  >
                    Previous
                  </button>
                  <button
                    v-for="page in totalPages"
                    :key="page"
                    class="btn"
                    :class="currentPage === page ? 'btn-primary' : 'btn-outline-primary'"
                    @click="changePage(page)"
                  >
                    {{ page }}
                  </button>
                  <button
                    class="btn btn-outline-secondary ms-2"
                    :disabled="currentPage === totalPages"
                    @click="nextPage"
                  >
                    Next
                  </button>
                </div>

                <!-- Affiliate Summary -->
                <div class="card shadow-sm">
                  <div class="text-center bg-success p-2 text-white">
                    <h5 class="mb-0 text-center">Affiliate Summary</h5>
                  </div>
                  <div class="card-body p-0">
                    <div class="table-responsive">
                      <table class="table table-striped mb-0">
                        <thead>
                          <tr>
                            <th>Affiliate Name</th>
                            <th>Code</th>
                            <th>Total Orders</th>
                            <th>Total Earnings (₦)</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr v-if="!affiliateSummary.length">
                            <td colspan="4" class="text-center text-muted">
                              No summary available
                            </td>
                          </tr>
                          <tr v-for="summary in affiliateSummary" :key="summary.code">
                            <td>{{ summary.name }}</td>
                            <td>{{ summary.code }}</td>
                            <td>{{ summary.totalOrders }}</td>
                            <td>{{ summary.totalEarnings }}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                <!-- Affiliate Orders -->
                <div class="card mb-4 shadow-sm">
                  <div class="text-center bg-success p-2 text-white">
                    <h5 class="mb-0 text-center">Affiliate Orders</h5>
                  </div>
                  <div class="card-body p-0">
                    <div class="table-responsive">
                      <table class="table table-striped mb-0">
                        <thead>
                          <tr>
                            <th>Reference</th>
                            <th>Affiliate Name</th>
                            <th>Code</th>
                            <th>Event Title</th>
                            <th>Price (₦)</th>
                            <th>Date</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr v-if="!affiliateOrders.length">
                            <td colspan="6" class="text-center text-muted">
                              No affiliate orders yet
                            </td>
                          </tr>
                          <tr v-for="order in affiliateOrders" :key="order.reference">
                            <td>{{ order.reference }}</td>
                            <td>{{ order.affiliateName }}</td>
                            <td>{{ order.affiliateCode }}</td>
                            <td>{{ order.title }}</td>
                            <td>{{ order.price }}</td>
                            <td>
                              {{ new Date(order.createdAt).toLocaleDateString() }}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-else-if="currentTab === 'Staff Member'">
          <!-- Staff Member Content -->
          <div class="row pt-2">
            <div class="col-md-4 text-start" v-if="staff && staff.length">
              <h5>👨‍💼 Staff Members</h5>
              <ul class="list-group shadow-sm">
                <li v-for="member in staff" :key="member._id" class="list-group-item">
                  <div><strong>Name:</strong> {{ member.name }}</div>
                  <div><strong>passcode:</strong> {{ member.passcode }}</div>
                  <div class="d-flex gap-2">
                    <button
                      class="btn btn-sm btn-outline-danger"
                      @click="deleteStaff(member._id)"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div v-else-if="currentTab === 'Discount'">
          <!-- Discount Content -->
          <discount />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import axios from "axios";
import discount from "@/components/dashboard/discount.vue";

export default {
  components: {
    discount,
  },
  data() {
    return {
      tabs: ["Affiliate", "Staff Member", "Discount"],
      currentTab: "Affiliate",
      searchQuery: "",
      currentPage: 1,
      rowsPerPage: 10,
      affiliates: [],
      affiliateOrders: [],
      affiliateSummary: [],
      products: [],
      selectedProductId: "",
      affiliateName: "",
      affiliateCode: "",
      affiliateLink: "",
      staff: [],
      isEditing: false,
      editId: null,
    };
  },
  computed: {
    ...mapGetters(["getToken"]),

    filterAffiliates() {
      const q = this.searchQuery.toLowerCase();
      return this.affiliates.filter(
        (a) => a.name.toLowerCase().includes(q) || a.code.toLowerCase().includes(q)
      );
    },

    totalPages() {
      return Math.ceil(this.filterAffiliates.length / this.rowsPerPage);
    },

    paginatedAffiliates() {
      const start = (this.currentPage - 1) * this.rowsPerPage;
      const end = start + this.rowsPerPage;
      return this.filterAffiliates.slice(start, end);
    },
  },
  mounted() {
    this.fetchAffiliates();
    this.fetchAffiliateOrders();
    this.fetchAffiliateSummary();
    this.fetchStaff();
  },
  methods: {
    async fetchStaff() {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/user-staff",
          {
            headers: { Authorization: `Bearer ${this.getToken}` },
          }
        );
        this.staff = res.data;
      } catch (err) {
        console.error("Error fetching staff:", err);
      }
    },
    async deleteStaff(id) {
      if (!confirm("Delete this bank info?")) return;
      try {
        await axios.delete(
          `http://localhost:5000/api/staff/${id}`,
          {
            headers: { Authorization: `Bearer ${this.getToken}` },
          }
        );
        this.staff = this.staff.filter((b) => b._id !== id);
      } catch (err) {
        console.error("Error deleting staff:", err);
      }
    },
    async createAffiliate() {
      if (!this.selectedProductId) {
        alert("Please select a product!");
        return;
      }
      if (!this.affiliateName || !this.affiliateCode) {
        alert("Please fill in both name and code!");
        return;
      }

      try {
        const res = await axios.post(
          "http://localhost:5000/api/affiliate",
          {
            name: this.affiliateName,
            code: this.affiliateCode,
            productId: this.selectedProductId,
          },
          {
            headers: {
              Authorization: `Bearer ${this.getToken}`,
            },
          }
        );

        console.log("Affiliate created:", res.data);
        this.fetchAffiliates();
        this.affiliateLink = res.data.link;
        alert("Affiliate link created!");
      } catch (error) {
        console.error("Error creating affiliate:", error);
        alert("Failed to create affiliate link!");
      }
    },
    fetchAffiliates() {
      axios
        .get("http://localhost:5000/api/affiliates", {
          headers: {
            Authorization: `Bearer ${this.getToken}`,
          },
        })
        .then((res) => {
          this.affiliates = res.data.affiliates || [];
        })
        .catch((err) => {
          console.error("Affiliate fetch error:", err.response?.data || err);
        });
    },
    fetchAffiliateOrders() {
      axios
        .get("http://localhost:5000/api/affiliate-orders", {
          headers: {
            Authorization: `Bearer ${this.getToken}`,
          },
        })
        .then((res) => {
          this.affiliateOrders = res.data.data || [];
          console.log("ordery", this.affiliateOrders);
        })
        .catch((err) => {
          console.error("Affiliate orders error:", err.response?.data || err);
        });
    },
    fetchAffiliateSummary() {
      axios
        .get(
          "http://localhost:5000/api/affiliate-orders-summary",
          {
            headers: {
              Authorization: `Bearer ${this.getToken}`,
            },
          }
        )
        .then((res) => {
          this.affiliateSummary = res.data.data || [];
          console.log("orderss", this.affiliateSummary);
        })
        .catch((err) => {
          console.error("Affiliate summary error:", err.response?.data || err);
        });
    },
    prevPage() {
      if (this.currentPage > 1) this.currentPage--;
    },
    nextPage() {
      if (this.currentPage < this.totalPages) this.currentPage++;
    },
    changePage(page) {
      this.currentPage = page;
    },
  },
  async created() {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/user/products",
        {
          headers: {
            Authorization: `Bearer ${this.getToken}`,
          },
        }
      );
      console.log("Fetched products:", res.data);
      this.products = res.data.products || [];
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  },
};
</script>
<style>
h1,
h2,
h3,
h4,
h5,
h6 {
  font-family: "Poppins", sans-serif;
  justify-content: center;
}
.tabs {
  display: flex;
  gap: 10px;
  margin-bottom: 1em;
}
button {
  padding: 6px 12px;
  cursor: pointer;
}
.active {
  background-color: #007bff;
  color: white;
}
.tab-content {
  border: 1px solid #ddd;
  padding: 1em;
}
.tes {
  text-transform: none !important;
}
.custom-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
}

.custom-table th,
.custom-table td {
  padding: 10px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

.custom-table th {
  background-color: #f5f5f5;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.custom-table td button {
  padding: 5px 10px;
  font-size: 14px;
  border-radius: 4px;
}

.custom-table td .dropdown-menu {
  margin-top: 5px;
}

.custom-table td .dropdown-menu button {
  width: 100%;
  text-align: left;
}
.pagination {
  display: flex;
  justify-content: center;
  margin-top: 10px;
}

.pagination button {
  border: 1px solid #ccc;
  background-color: #fff;
  color: #000;
  padding: 5px 10px;
  margin: 0 5px;
  cursor: pointer;
}

.pagination button.active {
  background-color: #f4a213;
  color: #fff;
}

.filter {
  margin-bottom: 10px;
}

.filter label {
  margin-right: 5px;
}
.table-container {
  overflow-x: auto;
}

.scrollable-tbody {
  display: block;
  white-space: nowrap;
}
</style>
