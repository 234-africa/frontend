<template>
  <div class="container my-5">
    <div class="ticket-footer d-block d-md-none p-2">
      <div class="text-white p-3 rounded-3 text-center" style="background-color: #047143">
        <small>subTotal: {{ formatPrice(subTotal, cartCurrency) }}</small>
        <div class="fw-bold fs-5 mb-1">Total: {{ formatPrice(cartTotal, cartCurrency) }}</div>
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
                  <p class="price">{{ formatPrice(ticket.price, ticket.currency) }}</p>
                </div>

                <!-- Optional: Add a quantity selector if needed -->
                <div>
                  <template v-if="ticket.quantity > 0">
                    <select
                      class="ticket-select mt-2"
                      v-model.number="ticket.selectedQuantity"
                    >
                      <option
                        v-for="n in Math.min(
                          ticket.purchaseLimit,
                          ticket.quantity || Infinity
                        ) + 1"
                        :key="n"
                        :value="n - 1"
                      >
                        {{ n - 1 }}
                      </option>
                    </select>
                  </template>
                  <template v-else>
                    <span class="text-danger fw-bold">Sold Out</span>
                  </template>
                </div>
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
            <div v-if="emailMismatch" class="text-danger mt-1">
              Email address does not match
            </div>
            <div class="mb-3">
              <label class="form-label">Phone Number *</label>
              <div class="input-group">
                <select v-model="contact.countryCode" class="form-select country-code-select">
                  <option v-for="(country, index) in processedCountryCodes" :key="`${country.code}-${country.name}-${index}`" :value="country.dialCode">
                    {{ country.flag }} {{ country.code }} {{ country.name }}
                  </option>
                </select>
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

          <!-- Paystack Payment (NGN, GHS) -->
          <div v-if="paymentGateway === 'paystack'" class="form-check mb-2">
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

          <!-- Stripe Payment (USD, GBP, EUR) -->
          <div v-if="paymentGateway === 'stripe'" class="mb-3">
            <div class="form-check mb-2">
              <input
                class="form-check-input"
                type="radio"
                v-model="paymentMethod"
                value="card"
                id="payStripe"
              />
              <label class="form-check-label" for="payStripe">Pay with Stripe</label>
            </div>
            
            <div v-if="paymentMethod === 'card'" class="mt-3">
              <div id="stripe-payment-element" class="p-3 border rounded"></div>
              <div v-if="stripeErrorMessage" class="alert alert-danger mt-2">
                {{ stripeErrorMessage }}
              </div>
            </div>
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
            Pay Now {{ formatPrice(cartTotal, cartCurrency) }}
          </button>
          <button
            v-if="currentStep < steps.length - 1"
            :disabled="(currentStep === 1 && emailMismatch) || !hasSelectedTickets"
            type="button"
            class="btn btn-primary"
            @click="nextStep"
          >
            Next
          </button>

          <!-- Only show when cartTotal is 0 -->
          <button
            v-else-if="cartTotal === 0"
            :disabled="emailMismatch || !contact.phone"
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

          <small>subTotal: {{ formatPrice(subTotal, cartCurrency) }}</small>
          <div class="fw-semibold fs-6">Service Charge (7.5%): {{ formatPrice(serviceCharge, cartCurrency) }}</div>

          <div class="fw-bold fs-5">Total: {{ formatPrice(cartTotal, cartCurrency) }}</div>
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
import { formatPrice, getCurrencySymbol, getPaymentGateway } from "@/helpers/currency";
import { loadStripe } from "@stripe/stripe-js";

export default {
  components: {
    paystack,
    QrcodeVue,
    spinner,
  },
  data() {
    return {
      currentStep: 0,
      emailMismatch: false,
      timer: "10:00",
      spinner: false,
      reference: "",
      showQRCode: false,
      countdown: null,
      full_name: "",
      publicKey: process.env.VUE_APP_PUBLIC_KEY,
      stripePublicKey: process.env.VUE_APP_STRIPE_PUBLIC_KEY,
      steps: ["Tickets", "Contact", "Payment"],
      tickets: [],
      promoCode: "",
      discountResult: null,
      contact: {
        firstName: "",
        lastName: "",
        email: "",
        confirmEmail: "",
        countryCode: "+234",
        phone: "",
      },
      countryCodes: [
        { code: "+93", dialCode: "+93", name: "Afghanistan", flag: "🇦🇫" },
        { code: "+355", dialCode: "+355", name: "Albania", flag: "🇦🇱" },
        { code: "+213", dialCode: "+213", name: "Algeria", flag: "🇩🇿" },
        { code: "+1-684", dialCode: "+1684", name: "American Samoa", flag: "🇦🇸" },
        { code: "+376", dialCode: "+376", name: "Andorra", flag: "🇦🇩" },
        { code: "+244", dialCode: "+244", name: "Angola", flag: "🇦🇴" },
        { code: "+1-264", dialCode: "+1264", name: "Anguilla", flag: "🇦🇮" },
        { code: "+1-268", dialCode: "+1268", name: "Antigua and Barbuda", flag: "🇦🇬" },
        { code: "+54", dialCode: "+54", name: "Argentina", flag: "🇦🇷" },
        { code: "+374", dialCode: "+374", name: "Armenia", flag: "🇦🇲" },
        { code: "+297", dialCode: "+297", name: "Aruba", flag: "🇦🇼" },
        { code: "+61", dialCode: "+61", name: "Australia", flag: "🇦🇺" },
        { code: "+43", dialCode: "+43", name: "Austria", flag: "🇦🇹" },
        { code: "+994", dialCode: "+994", name: "Azerbaijan", flag: "🇦🇿" },
        { code: "+1-242", dialCode: "+1242", name: "Bahamas", flag: "🇧🇸" },
        { code: "+973", dialCode: "+973", name: "Bahrain", flag: "🇧🇭" },
        { code: "+880", dialCode: "+880", name: "Bangladesh", flag: "🇧🇩" },
        { code: "+1-246", dialCode: "+1246", name: "Barbados", flag: "🇧🇧" },
        { code: "+375", dialCode: "+375", name: "Belarus", flag: "🇧🇾" },
        { code: "+32", dialCode: "+32", name: "Belgium", flag: "🇧🇪" },
        { code: "+501", dialCode: "+501", name: "Belize", flag: "🇧🇿" },
        { code: "+229", dialCode: "+229", name: "Benin", flag: "🇧🇯" },
        { code: "+1-441", dialCode: "+1441", name: "Bermuda", flag: "🇧🇲" },
        { code: "+975", name: "Bhutan", flag: "🇧🇹" },
        { code: "+591", name: "Bolivia", flag: "🇧🇴" },
        { code: "+387", name: "Bosnia and Herzegovina", flag: "🇧🇦" },
        { code: "+267", name: "Botswana", flag: "🇧🇼" },
        { code: "+55", name: "Brazil", flag: "🇧🇷" },
        { code: "+246", name: "British Indian Ocean Territory", flag: "🇮🇴" },
        { code: "+247", name: "Ascension Island", flag: "🇦🇨" },
        { code: "+1-284", name: "British Virgin Islands", flag: "🇻🇬" },
        { code: "+673", name: "Brunei", flag: "🇧🇳" },
        { code: "+359", name: "Bulgaria", flag: "🇧🇬" },
        { code: "+226", name: "Burkina Faso", flag: "🇧🇫" },
        { code: "+257", name: "Burundi", flag: "🇧🇮" },
        { code: "+855", name: "Cambodia", flag: "🇰🇭" },
        { code: "+237", name: "Cameroon", flag: "🇨🇲" },
        { code: "+1", name: "Canada", flag: "🇨🇦" },
        { code: "+238", name: "Cape Verde", flag: "🇨🇻" },
        { code: "+1-345", name: "Cayman Islands", flag: "🇰🇾" },
        { code: "+236", name: "Central African Republic", flag: "🇨🇫" },
        { code: "+235", name: "Chad", flag: "🇹🇩" },
        { code: "+56", name: "Chile", flag: "🇨🇱" },
        { code: "+86", name: "China", flag: "🇨🇳" },
        { code: "+672", name: "Norfolk Island / Antarctic Territories", flag: "🇳🇫" },
        { code: "+57", name: "Colombia", flag: "🇨🇴" },
        { code: "+269", name: "Comoros", flag: "🇰🇲" },
        { code: "+682", name: "Cook Islands", flag: "🇨🇰" },
        { code: "+506", name: "Costa Rica", flag: "🇨🇷" },
        { code: "+385", name: "Croatia", flag: "🇭🇷" },
        { code: "+53", name: "Cuba", flag: "🇨🇺" },
        { code: "+599", name: "Curacao / Caribbean Netherlands", flag: "🇨🇼" },
        { code: "+357", name: "Cyprus", flag: "🇨🇾" },
        { code: "+420", name: "Czech Republic", flag: "🇨🇿" },
        { code: "+243", name: "Democratic Republic of the Congo", flag: "🇨🇩" },
        { code: "+45", name: "Denmark", flag: "🇩🇰" },
        { code: "+253", name: "Djibouti", flag: "🇩🇯" },
        { code: "+1-767", name: "Dominica", flag: "🇩🇲" },
        { code: "+1-809", name: "Dominican Republic", flag: "🇩🇴" },
        { code: "+1-829", name: "Dominican Republic", flag: "🇩🇴" },
        { code: "+1-849", name: "Dominican Republic", flag: "🇩🇴" },
        { code: "+670", name: "East Timor", flag: "🇹🇱" },
        { code: "+593", name: "Ecuador", flag: "🇪🇨" },
        { code: "+20", name: "Egypt", flag: "🇪🇬" },
        { code: "+503", name: "El Salvador", flag: "🇸🇻" },
        { code: "+240", name: "Equatorial Guinea", flag: "🇬🇶" },
        { code: "+291", name: "Eritrea", flag: "🇪🇷" },
        { code: "+372", name: "Estonia", flag: "🇪🇪" },
        { code: "+251", name: "Ethiopia", flag: "🇪🇹" },
        { code: "+500", name: "Falkland Islands", flag: "🇫🇰" },
        { code: "+298", name: "Faroe Islands", flag: "🇫🇴" },
        { code: "+679", name: "Fiji", flag: "🇫🇯" },
        { code: "+358", name: "Finland", flag: "🇫🇮" },
        { code: "+33", name: "France", flag: "🇫🇷" },
        { code: "+594", name: "French Guiana", flag: "🇬🇫" },
        { code: "+689", name: "French Polynesia", flag: "🇵🇫" },
        { code: "+241", name: "Gabon", flag: "🇬🇦" },
        { code: "+220", name: "Gambia", flag: "🇬🇲" },
        { code: "+995", name: "Georgia", flag: "🇬🇪" },
        { code: "+49", name: "Germany", flag: "🇩🇪" },
        { code: "+233", name: "Ghana", flag: "🇬🇭" },
        { code: "+350", name: "Gibraltar", flag: "🇬🇮" },
        { code: "+30", name: "Greece", flag: "🇬🇷" },
        { code: "+299", name: "Greenland", flag: "🇬🇱" },
        { code: "+1-473", name: "Grenada", flag: "🇬🇩" },
        { code: "+590", name: "Guadeloupe", flag: "🇬🇵" },
        { code: "+1-671", name: "Guam", flag: "🇬🇺" },
        { code: "+502", name: "Guatemala", flag: "🇬🇹" },
        { code: "+44-1481", name: "Guernsey", flag: "🇬🇬" },
        { code: "+224", name: "Guinea", flag: "🇬🇳" },
        { code: "+245", name: "Guinea-Bissau", flag: "🇬🇼" },
        { code: "+592", name: "Guyana", flag: "🇬🇾" },
        { code: "+509", name: "Haiti", flag: "🇭🇹" },
        { code: "+504", name: "Honduras", flag: "🇭🇳" },
        { code: "+852", name: "Hong Kong", flag: "🇭🇰" },
        { code: "+36", name: "Hungary", flag: "🇭🇺" },
        { code: "+354", name: "Iceland", flag: "🇮🇸" },
        { code: "+91", name: "India", flag: "🇮🇳" },
        { code: "+62", name: "Indonesia", flag: "🇮🇩" },
        { code: "+98", name: "Iran", flag: "🇮🇷" },
        { code: "+964", name: "Iraq", flag: "🇮🇶" },
        { code: "+353", name: "Ireland", flag: "🇮🇪" },
        { code: "+44-1624", name: "Isle of Man", flag: "🇮🇲" },
        { code: "+972", name: "Israel", flag: "🇮🇱" },
        { code: "+39", name: "Italy", flag: "🇮🇹" },
        { code: "+225", name: "Ivory Coast", flag: "🇨🇮" },
        { code: "+1-876", name: "Jamaica", flag: "🇯🇲" },
        { code: "+81", name: "Japan", flag: "🇯🇵" },
        { code: "+44-1534", name: "Jersey", flag: "🇯🇪" },
        { code: "+962", name: "Jordan", flag: "🇯🇴" },
        { code: "+7", name: "Kazakhstan", flag: "🇰🇿" },
        { code: "+254", name: "Kenya", flag: "🇰🇪" },
        { code: "+686", name: "Kiribati", flag: "🇰🇮" },
        { code: "+383", name: "Kosovo", flag: "🇽🇰" },
        { code: "+965", name: "Kuwait", flag: "🇰🇼" },
        { code: "+996", name: "Kyrgyzstan", flag: "🇰🇬" },
        { code: "+856", name: "Laos", flag: "🇱🇦" },
        { code: "+371", name: "Latvia", flag: "🇱🇻" },
        { code: "+961", name: "Lebanon", flag: "🇱🇧" },
        { code: "+266", name: "Lesotho", flag: "🇱🇸" },
        { code: "+231", name: "Liberia", flag: "🇱🇷" },
        { code: "+218", name: "Libya", flag: "🇱🇾" },
        { code: "+423", name: "Liechtenstein", flag: "🇱🇮" },
        { code: "+370", name: "Lithuania", flag: "🇱🇹" },
        { code: "+352", name: "Luxembourg", flag: "🇱🇺" },
        { code: "+853", name: "Macau", flag: "🇲🇴" },
        { code: "+389", name: "Macedonia", flag: "🇲🇰" },
        { code: "+261", name: "Madagascar", flag: "🇲🇬" },
        { code: "+265", name: "Malawi", flag: "🇲🇼" },
        { code: "+60", name: "Malaysia", flag: "🇲🇾" },
        { code: "+960", name: "Maldives", flag: "🇲🇻" },
        { code: "+223", name: "Mali", flag: "🇲🇱" },
        { code: "+356", name: "Malta", flag: "🇲🇹" },
        { code: "+692", name: "Marshall Islands", flag: "🇲🇭" },
        { code: "+596", name: "Martinique", flag: "🇲🇶" },
        { code: "+222", name: "Mauritania", flag: "🇲🇷" },
        { code: "+230", name: "Mauritius", flag: "🇲🇺" },
        { code: "+262", name: "Mayotte", flag: "🇾🇹" },
        { code: "+52", name: "Mexico", flag: "🇲🇽" },
        { code: "+691", name: "Micronesia", flag: "🇫🇲" },
        { code: "+373", name: "Moldova", flag: "🇲🇩" },
        { code: "+377", name: "Monaco", flag: "🇲🇨" },
        { code: "+976", name: "Mongolia", flag: "🇲🇳" },
        { code: "+382", name: "Montenegro", flag: "🇲🇪" },
        { code: "+1-664", name: "Montserrat", flag: "🇲🇸" },
        { code: "+212", name: "Morocco", flag: "🇲🇦" },
        { code: "+258", name: "Mozambique", flag: "🇲🇿" },
        { code: "+95", name: "Myanmar", flag: "🇲🇲" },
        { code: "+264", name: "Namibia", flag: "🇳🇦" },
        { code: "+674", name: "Nauru", flag: "🇳🇷" },
        { code: "+977", name: "Nepal", flag: "🇳🇵" },
        { code: "+31", name: "Netherlands", flag: "🇳🇱" },
        { code: "+687", name: "New Caledonia", flag: "🇳🇨" },
        { code: "+64", name: "New Zealand", flag: "🇳🇿" },
        { code: "+505", name: "Nicaragua", flag: "🇳🇮" },
        { code: "+227", name: "Niger", flag: "🇳🇪" },
        { code: "+234", name: "Nigeria", flag: "🇳🇬" },
        { code: "+683", name: "Niue", flag: "🇳🇺" },
        { code: "+850", name: "North Korea", flag: "🇰🇵" },
        { code: "+1-670", name: "Northern Mariana Islands", flag: "🇲🇵" },
        { code: "+47", name: "Norway", flag: "🇳🇴" },
        { code: "+968", name: "Oman", flag: "🇴🇲" },
        { code: "+92", name: "Pakistan", flag: "🇵🇰" },
        { code: "+680", name: "Palau", flag: "🇵🇼" },
        { code: "+970", name: "Palestine", flag: "🇵🇸" },
        { code: "+507", name: "Panama", flag: "🇵🇦" },
        { code: "+675", name: "Papua New Guinea", flag: "🇵🇬" },
        { code: "+595", name: "Paraguay", flag: "🇵🇾" },
        { code: "+51", name: "Peru", flag: "🇵🇪" },
        { code: "+63", name: "Philippines", flag: "🇵🇭" },
        { code: "+64", name: "Pitcairn", flag: "🇵🇳" },
        { code: "+48", name: "Poland", flag: "🇵🇱" },
        { code: "+351", name: "Portugal", flag: "🇵🇹" },
        { code: "+1-787", name: "Puerto Rico", flag: "🇵🇷" },
        { code: "+1-939", name: "Puerto Rico", flag: "🇵🇷" },
        { code: "+974", name: "Qatar", flag: "🇶🇦" },
        { code: "+242", name: "Republic of the Congo", flag: "🇨🇬" },
        { code: "+262", name: "Reunion", flag: "🇷🇪" },
        { code: "+40", name: "Romania", flag: "🇷🇴" },
        { code: "+7", name: "Russia", flag: "🇷🇺" },
        { code: "+250", name: "Rwanda", flag: "🇷🇼" },
        { code: "+590", name: "Saint Barthelemy", flag: "🇧🇱" },
        { code: "+290", name: "Saint Helena", flag: "🇸🇭" },
        { code: "+1-869", name: "Saint Kitts and Nevis", flag: "🇰🇳" },
        { code: "+1-758", name: "Saint Lucia", flag: "🇱🇨" },
        { code: "+590", name: "Saint Martin", flag: "🇲🇫" },
        { code: "+508", name: "Saint Pierre and Miquelon", flag: "🇵🇲" },
        { code: "+1-784", name: "Saint Vincent and the Grenadines", flag: "🇻🇨" },
        { code: "+685", name: "Samoa", flag: "🇼🇸" },
        { code: "+378", name: "San Marino", flag: "🇸🇲" },
        { code: "+239", name: "Sao Tome and Principe", flag: "🇸🇹" },
        { code: "+966", name: "Saudi Arabia", flag: "🇸🇦" },
        { code: "+221", name: "Senegal", flag: "🇸🇳" },
        { code: "+381", name: "Serbia", flag: "🇷🇸" },
        { code: "+248", name: "Seychelles", flag: "🇸🇨" },
        { code: "+232", name: "Sierra Leone", flag: "🇸🇱" },
        { code: "+65", name: "Singapore", flag: "🇸🇬" },
        { code: "+1-721", name: "Sint Maarten", flag: "🇸🇽" },
        { code: "+421", name: "Slovakia", flag: "🇸🇰" },
        { code: "+386", name: "Slovenia", flag: "🇸🇮" },
        { code: "+677", name: "Solomon Islands", flag: "🇸🇧" },
        { code: "+252", name: "Somalia", flag: "🇸🇴" },
        { code: "+27", name: "South Africa", flag: "🇿🇦" },
        { code: "+82", name: "South Korea", flag: "🇰🇷" },
        { code: "+211", name: "South Sudan", flag: "🇸🇸" },
        { code: "+34", name: "Spain", flag: "🇪🇸" },
        { code: "+94", name: "Sri Lanka", flag: "🇱🇰" },
        { code: "+249", name: "Sudan", flag: "🇸🇩" },
        { code: "+597", name: "Suriname", flag: "🇸🇷" },
        { code: "+47", name: "Svalbard and Jan Mayen", flag: "🇸🇯" },
        { code: "+268", name: "Swaziland", flag: "🇸🇿" },
        { code: "+46", name: "Sweden", flag: "🇸🇪" },
        { code: "+41", name: "Switzerland", flag: "🇨🇭" },
        { code: "+963", name: "Syria", flag: "🇸🇾" },
        { code: "+886", name: "Taiwan", flag: "🇹🇼" },
        { code: "+992", name: "Tajikistan", flag: "🇹🇯" },
        { code: "+255", name: "Tanzania", flag: "🇹🇿" },
        { code: "+66", name: "Thailand", flag: "🇹🇭" },
        { code: "+228", name: "Togo", flag: "🇹🇬" },
        { code: "+690", name: "Tokelau", flag: "🇹🇰" },
        { code: "+676", name: "Tonga", flag: "🇹🇴" },
        { code: "+1-868", name: "Trinidad and Tobago", flag: "🇹🇹" },
        { code: "+216", name: "Tunisia", flag: "🇹🇳" },
        { code: "+90", name: "Turkey", flag: "🇹🇷" },
        { code: "+993", name: "Turkmenistan", flag: "🇹🇲" },
        { code: "+1-649", name: "Turks and Caicos Islands", flag: "🇹🇨" },
        { code: "+688", name: "Tuvalu", flag: "🇹🇻" },
        { code: "+1-340", name: "U.S. Virgin Islands", flag: "🇻🇮" },
        { code: "+256", name: "Uganda", flag: "🇺🇬" },
        { code: "+380", name: "Ukraine", flag: "🇺🇦" },
        { code: "+971", name: "United Arab Emirates", flag: "🇦🇪" },
        { code: "+44", name: "United Kingdom", flag: "🇬🇧" },
        { code: "+1", name: "United States", flag: "🇺🇸" },
        { code: "+598", name: "Uruguay", flag: "🇺🇾" },
        { code: "+998", name: "Uzbekistan", flag: "🇺🇿" },
        { code: "+678", name: "Vanuatu", flag: "🇻🇺" },
        { code: "+379", name: "Vatican", flag: "🇻🇦" },
        { code: "+58", name: "Venezuela", flag: "🇻🇪" },
        { code: "+84", name: "Vietnam", flag: "🇻🇳" },
        { code: "+681", name: "Wallis and Futuna", flag: "🇼🇫" },
        { code: "+212", name: "Western Sahara", flag: "🇪🇭" },
        { code: "+967", name: "Yemen", flag: "🇾🇪" },
        { code: "+260", name: "Zambia", flag: "🇿🇲" },
        { code: "+263", name: "Zimbabwe", flag: "🇿🇼" },
      ],
      paymentMethod: "",
      termsAccepted: false,
      subscribe: false,
      stripe: null,
      stripeElements: null,
      stripePaymentElement: null,
      stripeClientSecret: "",
      stripeReady: false,
      stripeErrorMessage: "",
    };
  },
  computed: {
    processedCountryCodes() {
      return this.countryCodes.map(country => ({
        ...country,
        dialCode: country.dialCode || country.code.replace(/-/g, '')
      }));
    },
    hasSelectedTickets() {
      return this.getCart.some((product) => {
        const tickets = product.event?.tickets;
        return (
          Array.isArray(tickets) &&
          tickets.some((ticket) => Number(ticket.selectedQuantity) > 0)
        );
      });
    },
    emailMismatch() {
      return this.contact.email !== this.contact.confirmEmail;
    },
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
    // Get the currency from the first ticket in the cart
    cartCurrency() {
      for (const product of this.getCart) {
        for (const ticket of product.event?.tickets || []) {
          if (ticket.selectedQuantity > 0 && ticket.currency) {
            return ticket.currency;
          }
        }
      }
      return "NGN"; // Default to NGN if no ticket found
    },
    // Determine payment gateway based on currency
    paymentGateway() {
      return getPaymentGateway(this.cartCurrency);
    },
  },
  watch: {
    currentStep(newVal) {
      this.updateProgressLine();
      
      if (newVal === 2 && this.paymentGateway === 'stripe') {
        this.$nextTick(() => {
          this.mountStripeElements();
        });
      }
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
    paymentMethod(newVal) {
      if (newVal === 'card' && this.paymentGateway === 'stripe' && !this.stripeReady) {
        this.$nextTick(() => {
          this.mountStripeElements();
        });
      }
    },
  },
  methods: {
    formatPrice,
    getCurrencySymbol,
    getPaymentGateway,
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
      if (this.paymentGateway === 'stripe') {
        await this.initializeStripePayment();
      } else {
        await this.initializePaystackPayment();
      }
    },
    async initializePaystackPayment() {
      try {
        this.spinner = true;
        const affiliate = localStorage.getItem("affiliateCode");
        const promoCode = localStorage.getItem("promoCode");
        
        const response = await axios.post(
          "https://event-ticket-backend-yx81.onrender.com/api/initialize",
          {
            email: this.email,
            amount: this.amount,
            currency: this.cartCurrency,
            metadata: {
              orderData: {
                startDate: this.getCart[0]?.event?.start,
                startTime: this.getCart[0]?.event?.startTime,
                location: this.getCart[0]?.event?.location?.name,
                userId: this.getCart[0]?.user,
                productId: this.getCart[0]?._id,
                title: this.getCart[0]?.title,
                contact: {
                  name: `${this.getContactInfo.firstName} ${this.getContactInfo.lastName}`,
                  email: this.getContactInfo.email,
                  phone: `${this.getContactInfo.countryCode}${this.getContactInfo.phone}`,
                },
                tickets: this.getSelectedTickets,
                price: this.amount,
                currency: this.cartCurrency,
                affiliate,
                promoCode,
              }
            }
          }
        );
        console.log(response.data);

        const { authorization_url, reference } = response.data.data;
        localStorage.setItem("paystack_reference", reference);
        localStorage.setItem("cartTotal", this.amount);
        localStorage.setItem("startDate", this.getCart[0]?.event?.start);
        localStorage.setItem("startTime", this.getCart[0]?.event?.startTime);
        localStorage.setItem("location", this.getCart[0]?.event?.location?.name);

        this.spinner = false;
        window.location.href = authorization_url;
      } catch (error) {
        this.spinner = false;
        alert("Payment initialization failed");
        console.error(error);
      }
    },
    async mountStripeElements() {
      if (this.stripeReady || !this.stripePublicKey) {
        return;
      }

      try {
        this.spinner = true;
        
        if (!this.stripe) {
          this.stripe = await loadStripe(this.stripePublicKey);
        }

        const affiliate = localStorage.getItem("affiliateCode");
        const promoCode = localStorage.getItem("promoCode");
        
        const response = await axios.post(
          "https://event-ticket-backend-yx81.onrender.com/api/stripe/create-payment-intent",
          {
            email: this.email,
            amount: this.amount,
            currency: this.cartCurrency,
            metadata: {
              orderData: JSON.stringify({
                startDate: this.getCart[0]?.event?.start,
                startTime: this.getCart[0]?.event?.startTime,
                location: this.getCart[0]?.event?.location?.name,
                userId: this.getCart[0]?.user,
                productId: this.getCart[0]?._id,
                title: this.getCart[0]?.title,
                contact: {
                  name: `${this.getContactInfo.firstName} ${this.getContactInfo.lastName}`,
                  email: this.getContactInfo.email,
                  phone: `${this.getContactInfo.countryCode}${this.getContactInfo.phone}`,
                },
                tickets: this.getSelectedTickets,
                price: this.amount,
                currency: this.cartCurrency,
                affiliate,
                promoCode,
              }),
            },
          }
        );

        this.stripeClientSecret = response.data.clientSecret;
        
        const options = {
          clientSecret: this.stripeClientSecret,
          appearance: {
            theme: 'stripe',
            variables: {
              colorPrimary: '#047143',
              colorBackground: '#ffffff',
              colorText: '#30313d',
            },
          },
        };

        this.stripeElements = this.stripe.elements(options);
        this.stripePaymentElement = this.stripeElements.create('payment');
        this.stripePaymentElement.mount('#stripe-payment-element');
        
        this.stripeReady = true;
        this.spinner = false;
      } catch (error) {
        this.spinner = false;
        console.error("Stripe initialization error:", error);
        this.stripeErrorMessage = "Failed to initialize payment. Please try again.";
      }
    },
    async initializeStripePayment() {
      if (!this.stripe || !this.stripeElements) {
        this.stripeErrorMessage = "Payment system not ready. Please refresh the page.";
        return;
      }

      try {
        this.spinner = true;
        this.stripeErrorMessage = "";

        const { error } = await this.stripe.confirmPayment({
          elements: this.stripeElements,
          confirmParams: {
            return_url: `${window.location.origin}/payment-success`,
          },
        });

        if (error) {
          this.stripeErrorMessage = error.message;
          this.spinner = false;
        }
      } catch (error) {
        this.spinner = false;
        this.stripeErrorMessage = "Payment failed. Please try again.";
        console.error("Stripe payment error:", error);
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
          productId: this.getCart[0]?._id,
          title: this.getCart[0]?.title,
          contact: {
            name: `${this.getContactInfo.firstName} ${this.getContactInfo.lastName}`,
            email: this.getContactInfo.email,
            phone: `${this.getContactInfo.countryCode}${this.getContactInfo.phone}`,
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

/* Country Code Dropdown Styling */
.country-code-select {
  max-width: 250px;
  border-right: none;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
  font-size: 0.95rem;
  padding: 0.375rem 0.75rem;
  background-color: #f8f9fa;
  border-color: #ced4da;
  transition: all 0.3s ease;
}

.country-code-select:focus {
  background-color: white;
  border-color: #f4a213;
  box-shadow: none;
}

.country-code-select option {
  padding: 8px;
}

.input-group .form-control {
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
}
</style>
