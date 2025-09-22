<template>
  <div class="">
    <!-- Create Promo Form -->

    <div class="row justify-content-center">
      <div class="col-12 col-sm-10 col-md-8 col-lg-6">
        <form @submit.prevent="createPromo" class="mx-auto mb-4">
          <div class="card shadow-sm">
            <div class="text-center bg-success p-2 text-white">
              <h5 class="mb-0">Create Promo Code</h5>
            </div>
            <div class="card-body">
              <div class="row g-3">
                <div class="col-md-6">
                  <label class="form-label">Enter Promo Code</label>
                  <input v-model="promo.code" placeholder="Code" class="form-control" />
                </div>

                <div class="col-md-6">
                  <label class="form-label">Enter Discount Type</label>
                  <select v-model="promo.discountType" class="form-select">
                    <option value="percentage">Percentage</option>
                    <option value="fixed">Fixed</option>
                  </select>
                </div>

                <div class="col-md-6">
                  <label class="form-label">Enter Discount Value</label>
                  <input
                    v-model.number="promo.discountValue"
                    type="number"
                    placeholder="Discount Value"
                    class="form-control"
                  />
                </div>

                <div class="col-md-6">
                  <label class="form-label">Expiry Date</label>
                  <input v-model="promo.expiryDate" type="date" class="form-control" />
                </div>

                <div class="col-md-6">
                  <label class="form-label">usage Limit</label>
                  <input
                    v-model.number="promo.usageLimit"
                    type="number"
                    placeholder="Usage Limit"
                    class="form-control"
                  />
                </div>

                <div class="col-12">
                  <label class="form-label">Select Events</label>
                  <div v-for="product in products" :key="product._id" class="form-check">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      :value="product._id"
                      v-model="promo.products"
                      :id="'product-' + product._id"
                    />
                    <label class="form-check-label" :for="'product-' + product._id">
                      {{ product.title }}
                    </label>
                  </div>
                </div>

                <div class="col-12 text-center">
                  <button type="submit" class="btn btn-sm btn-primary">
                    Create Promo
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>

    <!-- ✅ My Promos -->
    <div class="container my-4">
      <!-- My Promos -->
      <div class="card mb-4 shadow-sm">
        <div class="text-center bg-success p-2 text-white">
          <h5 class="mb-0">My Promos</h5>
        </div>
        <div class="card-body p-0">
          <div class="table-responsive">
            <table class="table table-striped mb-0">
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Discount</th>
                  <th>Usage Limit</th>
                  <th>used Count</th>
                  <th>Expiry</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="promos.length === 0">
                  <td colspan="4" class="text-center text-muted">No promos available</td>
                </tr>
                <tr v-for="promo in promos" :key="promo._id">
                  <td>{{ promo.code }}</td>
                  <td>{{ promo.discountValue }}%</td>
                  <td>{{ promo.usageLimit }}</td>
                  <td>{{ promo.usedCount }}</td>
                  <td>{{ formatDate(promo.expiryDate) }}</td>
                  <td>
                    <span
                      class="badge"
                      :class="isPromoActive(promo) ? 'bg-success' : 'bg-secondary'"
                    >
                      {{ isPromoActive(promo) ? "Active" : "Inactive" }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Promo Orders -->
      <div class="card shadow-sm">
        <div class="text-center bg-success p-2 text-white">
          <h5 class="mb-0">Promo Orders</h5>
        </div>
        <div class="card-body p-0">
          <div class="table-responsive">
            <table class="table table-striped mb-0">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Order title</th>
                  <th>Promo Code</th>
                  <th>Amount</th>
                  <th>order Date</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="promois.length === 0">
                  <td colspan="4" class="text-center text-muted">No promo orders</td>
                </tr>
                <tr v-for="order in promois" :key="order._id">
                  <td>{{ order.promoId }}</td>
                  <td>{{ order.title }}</td>
                  <td>{{ order.promoCode }}</td>
                  <td>₦{{ order.price }}</td>
                  <td>{{ formatDate(order.createdAt) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      promo: {
        code: "",
        discountType: "percentage",
        discountValue: 0,
        expiryDate: "",
        usageLimit: 0,
        minOrderAmount: 0,
        products: [],
      },
      promos: [], // ✅ my promos
      promois: [], // ✅ promo orders
      products: [],
    };
  },
  computed: {
    ...mapGetters(["getToken"]),
  },
  methods: {
    isPromoActive(promo) {
      const now = new Date();
      const expiry = new Date(promo.expiryDate);
      return promo.usedCount < promo.usageLimit && expiry >= now;
    },
    formatDate(date) {
      if (!date) return "-";
      return new Date(date).toLocaleDateString();
    },
    async createPromo() {
      try {
        await axios.post(
          "https://event-ticket-qa70.onrender.com/api/create-promo",
          this.promo,
          {
            headers: { Authorization: `Bearer ${this.getToken}` },
          }
        );
      } catch (err) {
        alert(JSON.stringify(err.response?.data.message));
      }
      this.fetchMyPromos();
    },

    async fetchMyPromos() {
      try {
        const res = await axios.get(
          "https://event-ticket-qa70.onrender.com/api/my-promos",
          {
            headers: { Authorization: `Bearer ${this.getToken}` },
          }
        );
        console.log("Token:", this.getToken);

        this.promos = res.data.promos || [];
        console.log(this.promos);
      } catch (err) {
        console.error("Error fetching my promos:", err.response?.data || err.message);
      }
    },

    async fetchPromos() {
      try {
        const res = await axios.get(
          "https://event-ticket-qa70.onrender.com/api/promo-orders",
          {
            headers: { Authorization: `Bearer ${this.getToken}` },
          }
        );
        // ✅ FIX: your API returns { success: true, data: [...] }
        this.promois = res.data.data || [];
      } catch (err) {
        console.error("Error fetching promo orders:", err.response?.data || err.message);
      }
    },

    async fetchProducts() {
      try {
        const res = await axios.get(
          "https://event-ticket-qa70.onrender.com/api/user/products",
          {
            headers: { Authorization: `Bearer ${this.getToken}` },
          }
        );
        this.products = res.data.products;
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    },
  },
  mounted() {
    this.fetchProducts();
    this.fetchMyPromos();
    this.fetchPromos();
  },
};
</script>
