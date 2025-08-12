<template>
  <div class="container text-center mt-5">
    <h2>🎉 Payment Status</h2>

    <div v-if="loading">Verifying payment...</div>
    <div v-else-if="verified">
      <p class="text-success">✅ Payment successful!</p>
      <p><strong>Reference:</strong> {{ reference }}</p>
      <qrcode-vue :value="reference" :size="200" />
    </div>
    <div v-else>
      <p class="text-danger">❌ Payment verification failed.</p>
    </div>

    <router-link to="/" class="btn btn-primary mt-3">Go Home</router-link>
  </div>
</template>

<script>
import axios from "axios";
import { mapGetters } from "vuex";
import QrcodeVue from "qrcode.vue";

export default {
  name: "PaymentSuccess",
  components: { QrcodeVue },
  data() {
    return {
      reference: "",
      verified: false,
      loading: true,
    };
  },
  computed: {
    ...mapGetters(["getContactInfo", "getCart","getSelectedTickets","getCartTotal"]),
  },
  methods: {
    async sendOrderInfo() {
      try {
        const reference = localStorage.getItem("paystack_reference");

        const payload = {
          reference, // Paystack reference
          title:this.getCart[0]?.title, // Get name from first cart item
          contact: {
            email: this.getContactInfo.email,
            phone: this.getContactInfo.phone,
          },
          userId: this.getCart[0]?.user, // Get user from first cart item
          tickets: this.getSelectedTickets, // Only selected ones
          price: this.getCartTotal, // Total price from cart
        };
        console.log("Sending order info:", payload);
        const res = await axios.post(
          "https://event-ticket-qa70.onrender.com/api/order",
          payload
        );
        console.log("Order info sent:", res.data);
      } catch (err) {
        console.error("Failed to send order info:", err);
      }
    },
  },
  async mounted() {
    this.reference = localStorage.getItem("paystack_reference");

    if (!this.reference) {
      this.loading = false;
      return;
    }

    try {
      const res = await axios.get(
        `https://event-ticket-qa70.onrender.com/api/verify/${this.reference}`
      );
      if (res.data.data.status === "success") {
        this.verified = true;
        await this.sendOrderInfo(); // Send order info after successful verification
      }
    } catch (err) {
      console.error("Verification error:", err);
    } finally {
      this.loading = false;
    }
  },
};
</script>

<style scoped>
.container {
  max-width: 500px;
  margin: auto;
}
</style>
