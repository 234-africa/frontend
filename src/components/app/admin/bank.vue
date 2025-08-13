<template>
  <div class="container mt-4">
    <!-- ✅ Create or Edit Form -->
    <div class="row">
      <div class="col-md-12 text-start" v-if="banks && banks.length">
        <ul class="list-group shadow-sm">
          <li v-for="bank in banks" :key="bank._id" class="list-group-item">
            <div class="mb-2">
              <div>
                <strong>Bank Account Number:</strong> {{ bank.accountName }}
              </div>
              <div>
                <strong>Account Number:</strong> {{ bank.accountNumber }}
              </div>
              <div><strong>Bank Name:</strong> {{ bank.bankName }}</div>
              <div><strong> Name:</strong> {{ bank.user }}</div>

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
        user :""
       
      },
      banks: [],
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
        const res = await axios.get(
          "https://event-ticket-qa70.onrender.com/api/all-banks",
          {}
        );
        console.log("Fetched banks:", res.data);
        this.banks = res.data.banks;
      } catch (err) {
        console.error("Error fetching banks:", err);
      }
    },
  },
};
</script>

<style scoped></style>
