<template>
  <div class="container mt-4">
    <!-- ✅ Create or Edit Form -->
    <div class="row">
      <div class="col-md-8">
        <form
          @submit.prevent="isEditing ? updateBank() : createBank()"
          class="shadow p-4 w-md-75 mx-auto w-100"
        >
          <h5>{{ isEditing ? "✏️ Edit Bank Info" : "➕ Add Bank Info" }}</h5>

          <div class="mb-3">
            <label>Account Name</label>
            <input
              v-model="form.accountName"
              type="text"
              class="form-control"
              required
            />
          </div>

          <div class="mb-3">
            <label>Account Number</label>
            <input
              v-model="form.accountNumber"
              type="text"
              class="form-control"
              required
            />
          </div>

          <div class="mb-3">
            <label>Bank Name</label>
            <input
              v-model="form.bankName"
              type="text"
              class="form-control"
              required
            />
          </div>

          <button type="submit" class="btn btn-success">
            {{ isEditing ? "Update" : "Create" }}
          </button>
          <button
            v-if="isEditing"
            type="button"
            class="btn btn-secondary ms-2"
            @click="cancelEdit"
          >
            Cancel
          </button>
        </form>
      </div>
      <div class="col-md-4 text-start" v-if="banks && banks.length">
        <ul class="list-group shadow-sm">
          <li v-for="bank in banks" :key="bank._id" class="list-group-item">
            <div class="mb-2">
              <div><strong>Bank Account Number:</strong> {{ bank.accountName }}</div>
              <div>
                <strong>Account Number:</strong> {{ bank.accountNumber }}
              </div>
              <div><strong>Bank Name:</strong> {{ bank.bankName }}</div>
            </div>
            <div class="d-flex gap-2">
              <button
                class="btn btn-sm btn-outline-warning"
                @click="editBank(bank)"
              >
                ✏️ Edit
              </button>
              <button
                class="btn btn-sm btn-outline-danger"
                @click="deleteBank(bank._id)"
              >
                🗑️ Delete
              </button>
            </div>
          </li>
        </ul>
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
        // Replace or set dynamically if needed
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
    async fetchBanks() {
      try {
        const res = await axios.get("https://event-ticket-qa70.onrender.com/api/bank", {
          headers: {
            Authorization: `Bearer ${this.getToken}`,
          },
        });
        console.log("Fetched banks:", res.data);
        this.banks = res.data.banks;
      } catch (err) {
        console.error("Error fetching banks:", err);
      }
    },
    async createBank() {
      try {
        const res = await axios.post(
          "https://event-ticket-qa70.onrender.com/api/bank",
          this.form,
          {
            headers: {
              Authorization: `Bearer ${this.getToken}`,
            },
          }
        );

        console.log("Bank created:", res.data);
        alert("✅ Bank created successfully!");

        if (res.data.banks && res.data.banks.length > 0) {
          this.banks.push(res.data.banks[0]); // ✅ Push only the new bank
        } else {
          await this.fetchBanks(); // fallback if no bank was returned
        }

        this.resetForm();
      } catch (err) {
        console.error("Error creating bank:", err);
        alert("❌ Failed to create.");
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
          `https://event-ticket-qa70.onrender.com/api/bank/${this.editId}`,
          this.form,
          {
            headers: {
              Authorization: `Bearer ${this.getToken}`,
            },
          }
        );

        const index = this.banks.findIndex((b) => b._id === this.editId);

        if (res.data.banks && res.data.banks.length > 0) {
          const updatedBank = res.data.banks[0];

          if (index !== -1) {
            this.banks.splice(index, 1, updatedBank); // ✅ Reactive array update
          }
        } else {
          await this.fetchBanks(); // fallback if API returns nothing
        }

        this.resetForm();
        //alert("✅ Bank updated!");
      } catch (err) {
        console.error("Error updating bank:", err);
        alert("❌ Update failed.");
      }
    },
    async deleteBank(id) {
      if (!confirm("Delete this bank info?")) return;
      try {
        await axios.delete(`https://event-ticket-qa70.onrender.com/api/bank/${id}`, {
          headers: {
            Authorization: `Bearer ${this.getToken}`,
          },
        });
        this.banks = this.banks.filter((b) => b._id !== id);
      } catch (err) {
        console.error("Error deleting bank:", err);
        alert("❌ Delete failed.");
      }
    },
    resetForm() {
      this.form = {
        accountName: "",
        accountNumber: "",
        bankName: "",
      };
      this.isEditing = false;
      this.editId = null;
    },
  },
};
</script>

<style scoped></style>
