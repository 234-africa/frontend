<template>
  <div class="container text-center mt-5 mb-5">
    <h2>🎉 Payment Status</h2>

    <div v-if="loading">Verifying payment...</div>
    <div v-else-if="verified">
      <p class="text-success">
        ✅ Payment successful! Your ticket has been confirmed, check your email inbox &
        spam for booking confirmation
      </p>
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
    ...mapGetters(["getContactInfo", "getCart", "getSelectedTickets", "getCartTotal"]),
  },
  methods: {
    async sendOrderInfo() {
      try {
        const reference = localStorage.getItem("paystack_reference");
        const affiliate = localStorage.getItem("affiliateCode");
        const promoCode = localStorage.getItem("promoCode");
        const startDate = localStorage.getItem("startDate");
        const startTime = localStorage.getItem("startTime");
        const location = localStorage.getItem("location");
        const price = Number(localStorage.getItem("finalSubtotal"));
        const payload = {
          startDate,
          startTime,
          location,
          promoCode,
          affiliate,
          reference,
          productId: this.getCart[0]?._id,
          title: this.getCart[0]?.title,
          contact: {
            name: `${this.getContactInfo.firstName} ${this.getContactInfo.lastName}`,
            email: this.getContactInfo.email,
            phone: this.getContactInfo.phone,
          },
          userId: this.getCart[0]?.user,
          tickets: this.getSelectedTickets,
          price,
        };
        console.log("Sending order info:", payload);
        const res = await axios.post(
          "https://event-ticket-backend-yx81.onrender.com/api/order",
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

    // Detect gateway from URL query param (?gateway=alatpay)
    const urlParams = new URLSearchParams(window.location.search);
    const gateway = urlParams.get("gateway");

    try {
      if (gateway === "alatpay") {
        // Alat Pay: payment already confirmed by the popup callback before redirect.
        // The onTransaction handler only redirects here on success, so we trust it
        // and create the order directly without a separate Paystack verify call.
        console.log("✅ Alat Pay redirect detected — marking as verified");
        this.verified = true;
        await this.sendOrderInfo();
      } else {
        // Paystack (default): verify via backend
        const res = await axios.get(
          `https://event-ticket-backend-yx81.onrender.com/api/verify/${this.reference}`
        );
        if (res.data.data.status === "success") {
          this.verified = true;
          await this.sendOrderInfo();
        }
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
