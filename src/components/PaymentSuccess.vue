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
          reference, // Paystack reference
          productId: this.getCart[0]?._id,
          title: this.getCart[0]?.title, // Get name from first cart item
          contact: {
            name: `${this.getContactInfo.firstName} ${this.getContactInfo.lastName}`,

            email: this.getContactInfo.email,
            phone: this.getContactInfo.phone,
          },
          userId: this.getCart[0]?.user, // Get user from first cart item
          tickets: this.getSelectedTickets, // Only selected ones
          price, // Total price from cart
        };
        console.log("Sending order info:", payload);
        const res = await axios.post(
          "https://event-ticket-backend-yx81.onrender.com/api/order",
          payload
        );
        console.log("Order info sent:", res.data);
        // ✅ Clear storage values after successful order
      } catch (err) {
        console.error("Failed to send order info:", err);
      }
    },
  },
  async mounted() {
    const urlParams = new URLSearchParams(window.location.search);
    const gatewayFromUrl = urlParams.get("gateway");
    const referenceFromUrl = urlParams.get("reference");
    const gateway = gatewayFromUrl || localStorage.getItem("payment_gateway") || "paystack";

    this.reference = referenceFromUrl || localStorage.getItem("paystack_reference");

    if (!this.reference) {
      this.loading = false;
      return;
    }

    try {
      if (gateway === "alatpay") {
        // AlatPay: order was already saved in the onTransaction callback before redirect.
        // Just show success - no need to verify or re-save the order.
        this.verified = true;
      } else {
        // Paystack: verify payment status via backend
        const res = await axios.get(
          `https://event-ticket-backend-yx81.onrender.com/api/verify/${this.reference}`
        );
        if (res.data.data.status === "success") {
          this.verified = true;
          // Order is created by Paystack webhook. sendOrderInfo is a fallback
          // only if cart/contact info is still in memory (same session).
          if (this.getCart && this.getCart.length > 0) {
            await this.sendOrderInfo();
          }
        }
      }
    } catch (err) {
      console.error("Verification error:", err);
    } finally {
      this.loading = false;
      localStorage.removeItem("payment_gateway");
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
