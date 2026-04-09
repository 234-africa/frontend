<template>
  <div class="payment-success-page">
    <!-- Loading State -->
    <div v-if="loading" class="loading-container">
      <div class="spinner-ring"></div>
      <p class="loading-text">Verifying your payment...</p>
    </div>

    <!-- Success State -->
    <div v-else-if="verified" class="result-card success-card">
      <div class="icon-circle success-icon-circle">
        <svg class="check-icon" viewBox="0 0 52 52">
          <circle class="check-circle" cx="26" cy="26" r="25" fill="none" />
          <path class="check-tick" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
        </svg>
      </div>

      <h1 class="result-title">Payment Successful!</h1>
      <p class="result-subtitle">
        Your booking has been confirmed. Check your email inbox (and spam) for your ticket and booking confirmation.
      </p>

      <div class="info-pills">
        <div class="pill">
          <span class="pill-icon">📧</span>
          <span>Ticket sent to your email</span>
        </div>
        <div class="pill">
          <span class="pill-icon">🎟️</span>
          <span>QR code included in PDF</span>
        </div>
        <div class="pill">
          <span class="pill-icon">⏱️</span>
          <span>Arrive 15 min early</span>
        </div>
      </div>

      <div class="action-buttons">
        <router-link to="/" class="btn-primary-action">Browse More Events</router-link>
      </div>
    </div>

    <!-- Failed State -->
    <div v-else class="result-card failed-card">
      <div class="icon-circle failed-icon-circle">
        <svg class="x-icon" viewBox="0 0 52 52">
          <circle class="x-circle" cx="26" cy="26" r="25" fill="none" />
          <path class="x-line" fill="none" d="M16 16 36 36 M36 16 16 36" />
        </svg>
      </div>

      <h1 class="result-title">Verification Failed</h1>
      <p class="result-subtitle">
        We could not verify your payment. If you were charged, please contact our support team with your payment reference.
      </p>

      <div class="action-buttons">
        <router-link to="/" class="btn-secondary-action">Go Home</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { mapGetters } from "vuex";

export default {
  name: "PaymentSuccess",
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
        this.verified = true;
      } else {
        const res = await axios.get(
          `https://event-ticket-backend-yx81.onrender.com/api/verify/${this.reference}`
        );
        if (res.data.data.status === "success") {
          this.verified = true;
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
.payment-success-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 50%, #f0f9ff 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 1rem;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

/* Loading */
.loading-container {
  text-align: center;
}

.spinner-ring {
  width: 60px;
  height: 60px;
  border: 5px solid #e0e0e0;
  border-top-color: #047143;
  border-radius: 50%;
  animation: spin 0.9s linear infinite;
  margin: 0 auto 1.5rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.loading-text {
  font-size: 1.1rem;
  color: #6b7280;
  font-weight: 500;
}

/* Result Card */
.result-card {
  background: white;
  border-radius: 24px;
  padding: 3rem 2.5rem;
  max-width: 520px;
  width: 100%;
  text-align: center;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.08), 0 4px 16px rgba(0, 0, 0, 0.04);
  animation: fadeInUp 0.5s ease;
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(24px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Icon Circle */
.icon-circle {
  width: 90px;
  height: 90px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.75rem;
}

.success-icon-circle {
  background: linear-gradient(135deg, #047143, #059669);
  box-shadow: 0 8px 30px rgba(4, 113, 67, 0.3);
}

.failed-icon-circle {
  background: linear-gradient(135deg, #dc2626, #ef4444);
  box-shadow: 0 8px 30px rgba(220, 38, 38, 0.25);
}

/* SVG Checkmark */
.check-icon,
.x-icon {
  width: 52px;
  height: 52px;
}

.check-circle {
  stroke: rgba(255, 255, 255, 0.4);
  stroke-width: 2;
}

.check-tick {
  stroke: white;
  stroke-width: 4;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-dasharray: 48;
  stroke-dashoffset: 48;
  animation: drawTick 0.5s 0.3s ease forwards;
}

@keyframes drawTick {
  to { stroke-dashoffset: 0; }
}

.x-circle {
  stroke: rgba(255, 255, 255, 0.4);
  stroke-width: 2;
}

.x-line {
  stroke: white;
  stroke-width: 4;
  stroke-linecap: round;
  stroke-dasharray: 30;
  stroke-dashoffset: 30;
  animation: drawX 0.4s 0.3s ease forwards;
}

@keyframes drawX {
  to { stroke-dashoffset: 0; }
}

/* Text */
.result-title {
  font-size: 1.9rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 0.75rem;
}

.result-subtitle {
  font-size: 1rem;
  color: #6b7280;
  line-height: 1.7;
  margin-bottom: 2rem;
  max-width: 400px;
  margin-left: auto;
  margin-right: auto;
}

/* Info Pills */
.info-pills {
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
  margin-bottom: 2rem;
}

.pill {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  border-radius: 12px;
  padding: 0.75rem 1.25rem;
  font-size: 0.9rem;
  color: #166534;
  font-weight: 500;
  text-align: left;
}

.pill-icon {
  font-size: 1.1rem;
  flex-shrink: 0;
}

/* Buttons */
.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.btn-primary-action {
  display: inline-block;
  padding: 0.85rem 2rem;
  background: linear-gradient(135deg, #f4a213 0%, #047143 100%);
  color: white;
  border-radius: 12px;
  font-weight: 700;
  font-size: 1rem;
  text-decoration: none;
  transition: all 0.3s ease;
  box-shadow: 0 4px 16px rgba(244, 162, 19, 0.3);
}

.btn-primary-action:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(244, 162, 19, 0.4);
  color: white;
  text-decoration: none;
}

.btn-secondary-action {
  display: inline-block;
  padding: 0.85rem 2rem;
  background: white;
  color: #374151;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  font-weight: 600;
  font-size: 1rem;
  text-decoration: none;
  transition: all 0.3s ease;
}

.btn-secondary-action:hover {
  border-color: #9ca3af;
  color: #111827;
  transform: translateY(-1px);
  text-decoration: none;
}

@media (max-width: 480px) {
  .result-card {
    padding: 2rem 1.25rem;
    border-radius: 20px;
  }

  .result-title {
    font-size: 1.5rem;
  }

  .icon-circle {
    width: 75px;
    height: 75px;
  }
}
</style>
