<template>
  <div class="container my-5">
    <div class="ticket-footer d-block d-md-none p-2">
      <div class="text-white p-3 rounded-3 text-center" style="background-color: #047143">
        <small>subTotal: {{ subTotal }}</small>
        <div class="fw-bold fs-5 mb-1">Total: ₦{{ cartTotal }}</div>
      </div>
    </div>

    <div class="row">
      <!-- Step Progress Bar -->

      <!-- Left column: steps -->

      <div class="col-md-8">
        <!-- Progress Bar -->
        <div class="stepper mb-5 position-relative">
          <!-- Progress Line -->
          <div class="progress-line">
            <div
              class="progress-fill"
              :style="{ width: (currentStep / (steps.length - 1)) * 100 + '%' }"
            ></div>
          </div>

          <!-- Steps -->
          <div
            v-for="(stepLabel, index) in steps"
            :key="index"
            class="currentStep text-center"
            :class="{
              'step-active': currentStep === index,
              'step-completed': index < currentStep,
            }"
          >
            <div class="circle">
              <span v-if="index < currentStep">✔</span>
              <span v-else>{{ index + 1 }}</span>
            </div>
            <div class="label">{{ stepLabel }}</div>
          </div>
        </div>

        <!-- Step 1: Ticket Selection -->
        <!-- Place this inside your Vue template -->
        <div v-if="currentStep === 0" class="ticket-section text-start">
          <h3>🎟️ Choose Tickets</h3>

          <div class="ticket-card" v-for="product in getCartSorted" :key="product._id">
            <!-- Loop through tickets inside each product -->
            <div v-for="ticket in product.event.tickets" :key="ticket._id" class="">
              <div class="ticket-content d-flex justify-content-between">
                <div>
                  <h5>{{ ticket.name }}</h5>
                  <p class="price">₦{{ ticket.price || 0 }}</p>
                </div>

                <!-- Optional: Add a quantity selector if needed -->
                <select
                  class="ticket-select mt-2"
                  v-model.number="ticket.selectedQuantity"
                >
                  <option
                    v-for="n in Math.min(ticket.quantity, 3) + 1"
                    :key="n"
                    :value="n - 1"
                  >
                    {{ n - 1 }}
                  </option>
                </select>
              </div>
            </div>
          </div>

          <div class="d-block d-md-none">
            <input
              v-model="promoCode"
              placeholder="Enter promo code"
              class="form-control mb-2"
            />

            <button @click="applyPromo" class="btn btn-primary">Apply</button>

            <div v-if="discountResult">
              <p>{{ discountResult.message }}</p>
            </div>
            <br />
            <small> Total includes a service fee </small>
          </div>
        </div>

        <!-- Step 2: Contact Info -->
        <div v-else-if="currentStep === 1" class="text-start">
          <h3>📇 Contact Information</h3>

          <form ref="myForm" @submit.prevent="">
            <div class="row mb-3">
              <div class="col">
                <label class="form-label">First Name *</label>
                <input
                  v-model="contact.firstName"
                  type="text"
                  class="form-control"
                  required
                />
              </div>
              <div class="col">
                <label class="form-label">Last Name *</label>
                <input
                  v-model="contact.lastName"
                  type="text"
                  class="form-control"
                  required
                />
              </div>
            </div>
            <div class="mb-3">
              <label class="form-label">Email Address *</label>
              <input v-model="contact.email" type="email" class="form-control" required />
            </div>
            <div class="mb-3">
              <label class="form-label">Confirm Email Address *</label>
              <input
                v-model="contact.confirmEmail"
                type="email"
                class="form-control"
                required
              />
            </div>
            <div class="mb-3">
              <label class="form-label">Phone Number *</label>
              <div class="input-group">
                <span class="input-group-text">+234</span>
                <input v-model="contact.phone" type="tel" class="form-control" required />
              </div>
            </div>
          </form>
        </div>

        <!-- Step 3: Payment -->
        <div v-else-if="currentStep === 2" class="text-start">
          <h3>💳 Payment Options</h3>

          <p class="alert alert-warning">
            We've reserved your ticket. Please complete checkout within
            {{ timer }} to secure your tickets.
          </p>

          <div class="form-check mb-2">
            <input
              class="form-check-input"
              type="radio"
              v-model="paymentMethod"
              value="card"
              id="payCard"
            />
            <label class="form-check-label" for="payCard">Pay with Paystack</label>
            <form>
              <div class="mb-3">
                <label>Email</label>
                <input
                  :value="getContactInfo.email"
                  type="email"
                  class="form-control"
                  readonly
                />
              </div>
            </form>
          </div>

          <div class="form-check mb-2">
            <input
              class="form-check-input"
              type="checkbox"
              v-model="termsAccepted"
              id="terms"
            />
            <label class="form-check-label" for="terms">
              I accept the <a href="#">234Africa Terms and Conditions</a>,
              <a href="#">Refund Policy</a> and <a href="#">Privacy Policy</a>.
            </label>
          </div>
        </div>
        <div class="text-center mt-4 d-flex justify-content-between">
          <button
            type="button"
            class="btn btn-danger"
            @click="prevStep"
            :disabled="currentStep === 0"
          >
            Back
          </button>
          <button
            v-if="currentStep === 2"
            type="submit"
            @click="initializePayment()"
            :disabled="!termsAccepted"
            class="btn btn-success"
          >
            Pay Now ₦{{ cartTotal.toLocaleString() }}
          </button>
          <button
            v-if="currentStep < steps.length - 1"
            type="button"
            class="btn btn-primary"
            @click="nextStep"
          >
            Next
          </button>

          <!-- Only show when cartTotal is 0 -->
          <button
            v-else-if="cartTotal === 0"
            type="submit"
            class="btn btn-primary"
            @click="getTicket()"
          >
            Get tickets
          </button>
        </div>
        <spinner v-if="spinner" />
      </div>

      <!-- Right column: Summary -->
      <div class="col-md-4 text-start d-none d-md-block">
        <div class="p-4 bg-light border-start">
          <h5>Summary</h5>
          <div v-if="selectedTickets.length" class="mt-4">
            <h5>🎟️ Selected Tickets:</h5>
            <ul>
              <li v-for="(ticket, index) in selectedTickets" :key="index">
                {{ ticket.name }} x {{ ticket.quantity }}
              </li>
            </ul>
          </div>

          <small>subTotal: {{ subTotal }}</small>
          <div class="fw-semibold fs-6">Service Charge (7.5%): ₦{{ serviceCharge }}</div>

          <div class="fw-bold fs-5">Total: ₦{{ cartTotal }}</div>
        </div>
        <div class="">
          <input
            v-model="promoCode"
            placeholder="Enter promo code"
            class="form-control mb-2"
          />

          <button @click="applyPromo" class="btn btn-primary">Apply</button>

          <div v-if="discountResult">
            <small>{{ discountResult.message }}</small>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
import axios from "axios";
import paystack from "vue-paystack";
import QrcodeVue from "qrcode.vue";
import spinner from "./spinner.vue";
import { ref } from "vue";
import { startOfDay } from "@fullcalendar/core/internal";
export default {
  components: {
    paystack,
    QrcodeVue,
    spinner,
  },
  data() {
    return {
      currentStep: 0,
      timer: "10:00",
      spinner: false,
      reference: "",
      showQRCode: false,
      countdown: null,
      full_name: "",
      publicKey: process.env.VUE_APP_PUBLIC_KEY,
      steps: ["Tickets", "Contact", "Payment"],
      tickets: [],
      promoCode: "",
      discountResult: null,
      contact: {
        firstName: "",
        lastName: "",
        email: "",
        confirmEmail: "",
        phone: "",
      },
      paymentMethod: "",
      termsAccepted: false,
      subscribe: false,
    };
  },
  computed: {
    getCartSorted() {
      return this.getCart.map((product) => {
        return {
          ...product,
          event: {
            ...product.event,
            tickets: [...product.event.tickets].sort((a, b) => a.price - b.price),
          },
        };
      });
    },
    // 1. Raw subtotal (tickets only, no service, no discount)
    rawSubtotal() {
      const subtotal = this.getCart.reduce((sum, product) => {
        const ticketTotal = product.event.tickets.reduce((innerSum, ticket) => {
          return innerSum + (ticket.selectedQuantity || 0) * (ticket.price || 0);
        }, 0);
        return sum + ticketTotal;
      }, 0);

      console.log("Raw Subtotal:", subtotal);
      return subtotal;
    },

    // Calculate discount based on raw subtotal
    discountAmount() {
      if (!this.discountResult) return 0;

      let discount = 0;
      if (this.discountResult.discountType === "percentage") {
        discount = this.rawSubtotal * (this.discountResult.discountValue / 100);
      } else if (this.discountResult.discountType === "flat") {
        discount = this.discountResult.discountValue;
      }

      console.log("Discount Applied:", discount);
      return +discount.toFixed(2);
    },

    // Subtotal after discount (raw subtotal - discount)
    subTotal() {
      const subTotal = this.rawSubtotal - this.discountAmount;
      console.log("Subtotal After Discount:", subTotal);
      return +subTotal.toFixed(2);
    },

    // Service charge based on subtotal after discount
    serviceCharge() {
      const charge = this.subTotal * 0.075;
      console.log("Service Charge (7.5%):", charge);
      return +charge.toFixed(2);
    },

    // Final cart total = subtotal after discount + service charge
    cartTotal() {
      const total = this.subTotal + this.serviceCharge;
      console.log("Final Cart Total:", total);
      return +total.toFixed(2);
    },

    email() {
      return this.getContactInfo.email;
    },
    amount() {
      return this.cartTotal;
    },
    steps() {
      // If the cart has a total greater than 0, show payment step
      return this.cartTotal > 0
        ? ["Tickets", "Contact", "Payment"]
        : ["Tickets", "Contact"];
    },
    ...mapGetters(["getCart", "getContactInfo", "getSelectedTickets", "getCartTotal"]),

    selectedTickets() {
      return this.getCart.flatMap((product) => {
        return (
          product.event?.tickets
            ?.filter((ticket) => ticket.selectedQuantity > 0)
            .map((ticket) => ({
              name: ticket.name,
              quantity: ticket.selectedQuantity,
            })) || []
        );
      });
    },

    canCheckout() {
      return this.paymentMethod && this.termsAccepted;
    },
  },
  watch: {
    currentStep() {
      this.updateProgressLine();
    },
    getCart: {
      handler() {
        this.discountResult = null;
        this.promoCode = null;
      },
      deep: true, // important! watches nested ticket quantities
    },
    promoCode(newVal) {
      if (!newVal || newVal.trim() === "") {
        localStorage.removeItem("promoCode");
        localStorage.removeItem("discountedTotal");
        this.discountResult = null;
      }
    },
    subTotal(newVal) {
      localStorage.setItem("finalSubtotal", newVal);
    },
  },
  methods: {
    formatDate(date) {
      if (!date) return "No date";
      const options = {
        weekday: "short",
        //year: "numeric",
        month: "short",
        day: "numeric",
      };
      return new Date(date).toLocaleDateString("en-US", options);
    },
    ...mapMutations(["setSelectedTickets"]),
    generateReference() {
      let text = "";
      const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      for (let i = 0; i < 10; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
      }
      return text;
    },
    extractSelectedTickets() {
      const selected = this.getCart.flatMap((product) => {
        return (
          product.event?.tickets
            ?.filter((ticket) => ticket.selectedQuantity > 0)
            .map((ticket) => ({
              name: ticket.name,
              quantity: ticket.selectedQuantity,
            })) || []
        );
      });

      // Save to Vuex
      this.setSelectedTickets(selected);
    },
    async initializePayment() {
      try {
        this.spinner = true; // Show spinner while processing
        const response = await axios.post(
          "https://event-ticket-backend-yx81.onrender.com/api/initialize",
          {
            email: this.email,
            amount: this.amount,
          }
        );
        console.log(response.data);

        const { authorization_url, reference } = response.data.data;
        // Save reference for verification later (optional)
        localStorage.setItem("paystack_reference", reference);
        localStorage.setItem("cartTotal", this.amount);
        localStorage.setItem("startDate", this.getCart[0]?.event?.start);
        localStorage.setItem("startTime", this.getCart[0]?.event?.startTime);
        localStorage.setItem("location", this.getCart[0]?.event?.location?.name);

        this.spinner = false; // Hide spinner after processing

        // Redirect to Paystack payment page
        window.location.href = authorization_url;
      } catch (error) {
        alert("Payment initialization failed");
        console.error(error);
      }
    },
    async getTicket() {
      try {
        this.reference = this.generateReference(); // generate and store
        localStorage.setItem("paystack_reference", this.reference);
        this.spinner = true; // Show spinner while processing
        const affiliate = localStorage.getItem("affiliateCode");

        const payload = {
          startDate: this.getCart[0]?.event?.start,
          startTime: this.getCart[0]?.event?.startTime,
          location: this.getCart[0]?.event?.location.name,
          reference: this.reference,
          userId: this.getCart[0]?.user,
          title: this.getCart[0]?.title,
          contact: {
            name: `${this.getContactInfo.firstName} ${this.getContactInfo.lastName}`,
            email: this.getContactInfo.email,
            phone: this.getContactInfo.phone,
          },
          tickets: this.getSelectedTickets,
          price: this.cartTotal,
          affiliate,
        };

        console.log("Sending order info:", payload);
        const res = await axios.post(
          "https://event-ticket-backend-yx81.onrender.com/api/order",
          payload
        );
        this.spinner = false; // Hide spinner after processing
        alert(
          "Your ticket has been confirmed, check your  email inbox & spam for booking confirmation"
        );
        //this.showQRCode = true;
        this.$refs.myForm.reset();
        this.$router.push({ name: "home" });
        console.log("Order info sent:", res.data);
      } catch (err) {
        console.error("Failed to send order info:", err);
      }
    },
    async applyPromo() {
      try {
        const payload = {
          code: this.promoCode,
          orderTotal: this.cartTotal,
          id: this.getCart[0].id,
        };

        console.log("Payload being sent:", payload);

        const res = await axios.post(
          "https://event-ticket-backend-yx81.onrender.com/api/apply-promo",
          payload
        );

        this.discountResult = res.data;
        localStorage.setItem("discountedTotal", res.data.newTotal);
        localStorage.setItem("promoCode", this.promoCode);
        console.log("Promo response:", res.data);
      } catch (err) {
        alert(`❌ ${err.response?.data?.message || err.message}`);
      }
    },

    processPayment: () => {
      window.alert("Payment recieved");
    },
    close: () => {
      console.log("You closed checkout page");
    },
    updateProgressLine() {
      const wrapper = this.$el.querySelector(".stepper-wrapper");
      if (wrapper) {
        const value = this.currentStep / (this.steps.length - 1);
        wrapper.style.setProperty("--progress", value);
      }
    },
    nextStep() {
      this.$store.dispatch("setContactInfo", this.contact);
      const selected = this.getCart.flatMap((product) =>
        product.event.tickets
          .filter((ticket) => ticket.selectedQuantity > 0)
          .map((ticket) => ({
            name: ticket.name,
            quantity: ticket.selectedQuantity,
          }))
      );

      // Save to Vuex
      this.$store.commit("setSelectedTickets", selected);
      if (this.currentStep < this.steps.length - 1) this.currentStep++;
    },
    prevStep() {
      if (this.currentStep > 0) this.currentStep--;
    },

    checkout() {
      alert("✅ Checkout successful!");
    },
    startTimer() {
      let totalSeconds = 600;
      this.countdown = setInterval(() => {
        totalSeconds--;
        const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
        const seconds = String(totalSeconds % 60).padStart(2, "0");
        this.timer = `${minutes}:${seconds}`;
        if (totalSeconds <= 0) {
          clearInterval(this.countdown);
          alert("⏰ Time expired! Please restart.");
          location.reload();
        }
      }, 1000);
    },
  },
  mounted() {
    this.startTimer();

    this.updateProgressLine();
  },
  beforeUnmount() {
    clearInterval(this.countdown);
  },
};
</script>

<style scoped>
.qr-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1050;
}
.modal-content {
  background: #fff;
  padding: 30px;
  border-radius: 16px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  animation: fadeIn 0.3s ease-in-out;
}

.ticket-footer {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background: white;
  padding: 10px 20px;
  box-shadow: 0 -2px 5px rgba(0, 0, 0, 0.1);
  text-align: center;
  z-index: 9999;
}
.ticket-section {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

h3 {
  font-size: 1.5rem;
  margin-bottom: 20px;
  color: #2c3e50;
}

.ticket-card {
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  padding: 20px;
  margin-bottom: 20px;
}

.ticket-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.ticket-info h5 {
  font-size: 1.1rem;
  margin: 0 0 5px;
  color: #2c3e50;
}

.price {
  font-weight: bold;
  color: #e74c3c;
  margin: 0 0 5px;
}

.access {
  font-size: 0.9rem;
  color: #7f8c8d;
  margin: 0;
}

.ticket-select {
  padding: 8px 10px;
  font-size: 1rem;
  border-radius: 6px;
  border: 1px solid #ccc;
  outline: none;
}

.stepper-wrapper {
  position: relative;
  width: 100%;
  padding: 0 15px;
}

.stepper {
  position: relative;
  align-items: center;
  display: flex;
}

.currentStep {
  position: relative;
  z-index: 2;
  flex: 1;
}

.circle {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: 2px solid #adb5bd;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 8px;
  background-color: white;
  color: #adb5bd;
  font-weight: bold;
}

.currentStep.step-active .circle {
  border-color: #f4a213;
  background-color: #f4a213;
  color: white;
  transition: background-color 0.3s, border-color 0.3s;
}

.currentStep.completed .circle {
  background-color: #f4a213;
  color: white;
  border-color: #f4a213;
}

.label {
  font-size: 14px;
  color: #6c757d;
}

.currentStep.step-active .label,
.currentStep.step-completed .label {
  color: #f4a213;
}

/* Progress line behind steps */
.progress-line {
  position: absolute;
  top: 15px;
  left: 0;
  right: 0;
  height: 2px;
  background-color: #dee2e6;
  z-index: 1;
}

.progress-fill {
  height: 100%;
  background-color: #f4a213;
  width: 0%;
  transition: width 0.4s ease-in-out;
}
</style>
