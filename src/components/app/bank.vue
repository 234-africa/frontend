<template>
  <div class="dashboard-modern">
    <div class="container-fluid px-4 py-4">
      <div class="dashboard-header mb-4">
        <h1 class="dashboard-title"><i class="bi bi-bank"></i> Bank Management</h1>
        <p class="dashboard-subtitle">Manage your bank account information</p>
      </div>

      <div class="row">
        <div class="col-md-8">
          <div class="modern-card">
            <div class="card-header">
              <h4 class="card-title mb-0">{{ isEditing ? "✏️ Edit Bank Info" : "➕ Add Bank Info" }}</h4>
            </div>
            <div class="card-body">
              <form @submit.prevent="isEditing ? updateBank() : createBank()">
                <div class="mb-3">
                  <label>Account Name</label>
                  <input v-model="form.accountName" type="text" class="modern-form-control" required />
                </div>

                <div class="mb-3">
                  <label>Account Number</label>
                  <input
                    v-model="form.accountNumber"
                    type="text"
                    class="modern-form-control"
                    required
                  />
                </div>

                <div class="mb-3">
                  <label>Bank Name</label>
                  <input v-model="form.bankName" type="text" class="modern-form-control" required />
                </div>

                <button type="submit" class="modern-btn-primary">
                  {{ isEditing ? "Update" : "Create" }}
                </button>
                <button
                  v-if="isEditing"
                  type="button"
                  class="modern-btn-secondary ms-2"
                  @click="cancelEdit"
                >
                  Cancel
                </button>
              </form>
            </div>
          </div>
        </div>
        <div class="text-start col-md-4" v-if="banks && banks.length">
        <ul class="list-group shadow-sm">
          <li v-for="bank in banks" :key="bank._id" class="list-group-item">
            <div class="mb-2">
              <div><strong>Bank Account Name:</strong> {{ bank.accountName }}</div>
              <div><strong>Account Number:</strong> {{ bank.accountNumber }}</div>
              <div><strong>Bank Name:</strong> {{ bank.bankName }}</div>
            </div>
            <div class="d-flex gap-2">
              <button class="btn btn-sm btn-outline-warning" @click="editBank(bank)">
                ✏️ Edit
              </button>
              <button class="btn btn-sm btn-outline-danger" @click="deleteBank(bank._id)">
                🗑️ Delete
              </button>
            </div>
          </li>
        </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { mapGetters } from "vuex";

export default {
  name: "BankManager",
  data() {
    return {
      form: {
        accountName: "",
        accountNumber: "",
        bankName: "",
      },
      banks: [],

      isEditing: false,
      editId: null,
    };
  },
  mounted() {
    this.fetchBanks();
  },
  computed: {
    ...mapGetters(["getToken"]),
  },
  methods: {
    /** ✅ BANK METHODS **/
    async fetchBanks() {
      try {
        const res = await axios.get(
          "https://event-ticket-backend-yx81.onrender.com/api/bank",
          {
            headers: { Authorization: `Bearer ${this.getToken}` },
          }
        );
        this.banks = res.data.banks;
      } catch (err) {
        console.error("Error fetching banks:", err);
      }
    },
    async createBank() {
      try {
        const res = await axios.post(
          "https://event-ticket-backend-yx81.onrender.com/api/bank",
          this.form,
          {
            headers: { Authorization: `Bearer ${this.getToken}` },
          }
        );

        if (res.data.banks && res.data.banks.length > 0) {
          this.banks.push(res.data.banks[0]);
        } else {
          await this.fetchBanks();
        }
        
        this.$swal({
          icon: 'success',
          title: 'Success!',
          text: 'Bank account created successfully!',
          confirmButtonColor: '#047143',
          iconColor: '#047143',
          timer: 2000,
          timerProgressBar: true
        });
        
        this.resetForm();
      } catch (err) {
        console.error("Error creating bank:", err);
        this.$swal({
          icon: 'error',
          title: 'Error',
          text: err.response?.data?.message || 'Failed to create bank account.',
          confirmButtonColor: '#f4a213',
          iconColor: '#f4a213'
        });
      }
    },
    editBank(bank) {
      this.isEditing = true;
      this.editId = bank._id;
      this.form = { ...bank };
    },
    cancelEdit() {
      this.resetForm();
    },
    async updateBank() {
      try {
        const res = await axios.put(
          `https://event-ticket-backend-yx81.onrender.com/api/bank/${this.editId}`,
          this.form,
          {
            headers: { Authorization: `Bearer ${this.getToken}` },
          }
        );
        const index = this.banks.findIndex((b) => b._id === this.editId);
        if (res.data.banks && res.data.banks.length > 0) {
          this.banks.splice(index, 1, res.data.banks[0]);
        } else {
          await this.fetchBanks();
        }
        this.resetForm();
      } catch (err) {
        console.error("Error updating bank:", err);
      }
    },
    async deleteBank(id) {
      const result = await this.$swal({
        icon: 'warning',
        title: 'Are you sure?',
        text: 'Do you want to delete this bank info?',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it',
        cancelButtonText: 'Cancel',
        confirmButtonColor: '#f4a213',
        cancelButtonColor: '#047143',
        iconColor: '#f4a213',
        reverseButtons: true
      });
      
      if (!result.isConfirmed) return;
      
      try {
        await axios.delete(`https://event-ticket-backend-yx81.onrender.com/api/bank/${id}`, {
          headers: { Authorization: `Bearer ${this.getToken}` },
        });
        this.banks = this.banks.filter((b) => b._id !== id);
        
        this.$swal({
          icon: 'success',
          title: 'Deleted!',
          text: 'Bank account deleted successfully',
          confirmButtonColor: '#047143',
          iconColor: '#047143',
          timer: 2000,
          timerProgressBar: true
        });
      } catch (err) {
        console.error("Error deleting bank:", err);
        this.$swal({
          icon: 'error',
          title: 'Error',
          text: err.response?.data?.message || 'Failed to delete bank account',
          confirmButtonColor: '#f4a213',
          iconColor: '#f4a213'
        });
      }
    },

    resetForm() {
      this.form = { accountName: "", accountNumber: "", bankName: "" };
      this.isEditing = false;
      this.editId = null;
    },

    /** ✅ STAFF METHODS **/
  },
};
</script>

<style scoped>
@import '../dashboard/dashboard-modern.css';
</style>
