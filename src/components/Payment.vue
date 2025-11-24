<template>
  <div class="checkout-container">
    <!-- Mobile Price Footer -->
    <div class="mobile-price-footer d-block d-md-none">
      <div class="mobile-price-content">
        <small>subTotal: {{ formatPrice(subTotal, cartCurrency) }}</small>
        <div class="mobile-total">Total: {{ formatPrice(cartTotal, cartCurrency) }}</div>
      </div>
    </div>

    <div class="checkout-wrapper">
      <!-- Main Checkout Area -->
      <div class="checkout-main">
        <!-- Enhanced Progress Stepper -->
        <div class="progress-stepper">
          <div class="stepper-track"></div>
          <div class="stepper-progress" :style="{ width: progressWidth }"></div>
          
          <div 
            v-for="(stepLabel, index) in steps" 
            :key="index"
            class="step-item"
            :class="{
              'active': currentStep === index,
              'completed': index < currentStep
            }"
          >
            <div class="step-indicator">
              <span v-if="index < currentStep" class="checkmark">✔</span>
              <span v-else class="step-number">{{ index + 1 }}</span>
            </div>
            <div class="step-label">{{ stepLabel }}</div>
          </div>
        </div>

        <!-- Step Content Area -->
        <div class="step-content">
          <!-- Step 1: Ticket Selection -->
          <div v-if="currentStep === 0" class="content-section">
            <h3 class="section-title">🎟️ Choose Tickets</h3>

            <div class="tickets-list">
              <div 
                v-for="product in getCartSorted" 
                :key="product._id"
                class="product-group"
              >
                <div 
                  v-for="ticket in product.event.tickets" 
                  :key="ticket._id" 
                  class="ticket-item"
                >
                  <div class="ticket-details">
                    <h5 class="ticket-name">{{ ticket.name }}</h5>
                    <p class="ticket-price">{{ formatPrice(ticket.price, ticket.currency) }}</p>
                  </div>

                  <div class="ticket-selector">
                    <template v-if="ticket.quantity > 0">
                      <select
                        class="quantity-select"
                        v-model.number="ticket.selectedQuantity"
                      >
                        <option
                          v-for="n in Math.min(ticket.purchaseLimit, ticket.quantity || Infinity) + 1"
                          :key="n"
                          :value="n - 1"
                        >
                          {{ n - 1 }}
                        </option>
                      </select>
                    </template>
                    <template v-else>
                      <span class="sold-out-badge">Sold Out</span>
                    </template>
                  </div>
                </div>
              </div>
            </div>

            <!-- Mobile Promo Code -->
            <div class="mobile-promo d-block d-md-none">
              <input
                v-model="promoCode"
                placeholder="Enter promo code"
                class="promo-input"
              />
              <button @click="applyPromo" class="apply-btn">Apply</button>
              <div v-if="discountResult" class="discount-message">
                <p>{{ discountResult.message }}</p>
              </div>
              <small class="fee-notice">Total includes a service fee</small>
            </div>
          </div>

          <!-- Step 2: Contact Info -->
          <div v-else-if="currentStep === 1" class="content-section">
            <h3 class="section-title">📇 Contact Information</h3>

            <form ref="myForm" @submit.prevent="" class="contact-form">
              <div class="form-row">
                <div class="form-group">
                  <label class="input-label">First Name *</label>
                  <input
                    v-model="contact.firstName"
                    type="text"
                    class="form-input"
                    placeholder="Enter first name"
                    required
                  />
                </div>
                <div class="form-group">
                  <label class="input-label">Last Name *</label>
                  <input
                    v-model="contact.lastName"
                    type="text"
                    class="form-input"
                    placeholder="Enter last name"
                    required
                  />
                </div>
              </div>

              <div class="form-group">
                <label class="input-label">Email Address *</label>
                <input 
                  v-model="contact.email" 
                  type="email" 
                  class="form-input"
                  placeholder="your.email@example.com"
                  required 
                />
              </div>

              <div class="form-group">
                <label class="input-label">Confirm Email Address *</label>
                <input
                  v-model="contact.confirmEmail"
                  type="email"
                  class="form-input"
                  placeholder="Confirm your email"
                  required
                />
              </div>

              <div v-if="emailMismatch" class="error-message">
                Email addresses do not match
              </div>

              <div class="form-group phone-group">
                <label class="input-label">Phone Number *</label>
                <div class="phone-input-wrapper">
                  <select 
                    v-model="contact.countryCode" 
                    class="country-select"
                  >
                    <option 
                      v-for="(country, index) in processedCountryCodes" 
                      :key="`${country.code}-${country.name}-${index}`" 
                      :value="country.dialCode"
                    >
                      {{ country.flag }} {{ country.dialCode }}
                    </option>
                  </select>
                  <input 
                    v-model="contact.phone" 
                    type="tel" 
                    class="phone-input"
                    placeholder="Enter phone number"
                    required 
                  />
                </div>
              </div>
            </form>
          </div>

          <!-- Step 3: Payment -->
          <div v-else-if="currentStep === 2" class="content-section">
            <h3 class="section-title">💳 Payment Options</h3>

            <div class="timer-alert">
              We've reserved your ticket. Please complete checkout within
              {{ timer }} to secure your tickets.
            </div>

            <!-- Gateway Selection (when multiple options available) -->
            <div v-if="hasMultipleGateways" class="gateway-selection">
              <p class="gateway-instruction">Choose your preferred payment gateway:</p>
              <div class="gateway-options">
                <div 
                  v-for="gateway in availablePaymentGateways" 
                  :key="gateway" 
                  class="gateway-option"
                  :class="{ 'selected': selectedPaymentGateway === gateway }"
                  @click="selectGateway(gateway)"
                >
                  <input
                    type="radio"
                    :id="`gateway-${gateway}`"
                    v-model="selectedPaymentGateway"
                    :value="gateway"
                    class="gateway-radio"
                    @change="selectGateway(gateway)"
                  />
                  <label :for="`gateway-${gateway}`" class="gateway-label">
                    <span class="gateway-name">{{ gateway === 'paystack' ? 'Paystack' : 'Fincra' }}</span>
                    <span class="gateway-badge">{{ gateway === 'paystack' ? '🇳🇬' : '🌍' }}</span>
                  </label>
                </div>
              </div>
            </div>

            <!-- Paystack Payment -->
            <div v-if="availablePaymentGateways.includes('paystack') && (!hasMultipleGateways || selectedPaymentGateway === 'paystack')" class="payment-option">
              <input
                class="payment-radio"
                type="radio"
                v-model="paymentMethod"
                value="card"
                id="payCard"
              />
              <label class="payment-label" for="payCard">
                {{ hasMultipleGateways ? 'Paystack Payment Details' : 'Pay with Paystack' }}
              </label>
              <form class="payment-form">
                <div class="form-group">
                  <label class="input-label">Email</label>
                  <input
                    :value="getContactInfo.email"
                    type="email"
                    class="form-input"
                    readonly
                  />
                </div>
              </form>
            </div>

            <!-- Fincra Payment -->
            <div v-if="availablePaymentGateways.includes('fincra') && (!hasMultipleGateways || selectedPaymentGateway === 'fincra')" class="payment-option">
              <input
                class="payment-radio"
                type="radio"
                v-model="paymentMethod"
                value="card"
                id="payFincra"
              />
              <label class="payment-label" for="payFincra">
                {{ hasMultipleGateways ? 'Fincra Payment Details' : 'Pay with Fincra' }}
              </label>
              <form class="payment-form">
                <div class="form-group">
                  <label class="input-label">Email</label>
                  <input
                    :value="getContactInfo.email"
                    type="email"
                    class="form-input"
                    readonly
                  />
                </div>
              </form>
            </div>

            <!-- Terms & Conditions -->
            <div class="terms-wrapper">
              <input
                class="terms-checkbox"
                type="checkbox"
                v-model="termsAccepted"
                id="terms"
              />
              <label class="terms-label" for="terms">
                I accept the <a href="#">234Africa Terms and Conditions</a>,
                <a href="#">Refund Policy</a> and <a href="#">Privacy Policy</a>.
              </label>
            </div>
          </div>
        </div>

        <!-- Navigation Buttons -->
        <div class="nav-buttons">
          <button
            type="button"
            class="nav-btn back-btn"
            @click="prevStep"
            :disabled="currentStep === 0"
          >
            Back
          </button>
          
          <button
            v-if="currentStep === 2 && cartTotal > 0"
            type="submit"
            @click="initializePayment()"
            :disabled="!termsAccepted || (hasMultipleGateways && !selectedPaymentGateway)"
            class="nav-btn pay-btn"
          >
            Pay Now {{ formatPrice(cartTotal, cartCurrency) }}
          </button>
          
          <button
            v-if="currentStep < steps.length - 1"
            :disabled="(currentStep === 1 && emailMismatch) || !hasSelectedTickets"
            type="button"
            class="nav-btn next-btn"
            @click="nextStep"
          >
            Next
          </button>

          <button
            v-else-if="cartTotal === 0"
            :disabled="emailMismatch || !contact.phone"
            type="submit"
            class="nav-btn get-tickets-btn"
            @click="getTicket()"
          >
            Get tickets
          </button>
        </div>

        <spinner v-if="spinner" />
      </div>

      <!-- Sidebar Summary -->
      <div class="checkout-sidebar d-none d-md-block">
        <div class="summary-card">
          <h5 class="summary-title">Summary</h5>
          
          <div v-if="selectedTickets.length" class="selected-tickets">
            <h6 class="tickets-heading">🎟️ Selected Tickets:</h6>
            <ul class="tickets-list-summary">
              <li v-for="(ticket, index) in selectedTickets" :key="index">
                {{ ticket.name }} x {{ ticket.quantity }}
              </li>
            </ul>
          </div>

          <div class="price-breakdown">
            <div class="price-row subtotal">
              <span>Subtotal:</span>
              <span>{{ formatPrice(subTotal, cartCurrency) }}</span>
            </div>
            <div class="price-row service-charge">
              <span>Service Charge (7.5%):</span>
              <span>{{ formatPrice(serviceCharge, cartCurrency) }}</span>
            </div>
            <div class="price-row total">
              <span>Total:</span>
              <span>{{ formatPrice(cartTotal, cartCurrency) }}</span>
            </div>
          </div>
        </div>

        <!-- Desktop Promo Code -->
        <div class="promo-section">
          <input
            v-model="promoCode"
            placeholder="Enter promo code"
            class="promo-input"
          />
          <button @click="applyPromo" class="apply-btn">Apply</button>
          <div v-if="discountResult" class="discount-message">
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
import QrcodeVue from "qrcode.vue";
import spinner from "./spinner.vue";
import { ref } from "vue";
import { startOfDay } from "@fullcalendar/core/internal";
import { formatPrice, getCurrencySymbol, getPaymentGateway, getAvailablePaymentGateways } from "@/helpers/currency";

export default {
  components: {
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
      selectedPaymentGateway: null,
      isGatewayManuallySelected: false,
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
        { code: "+975", dialCode: "+975", name: "Bhutan", flag: "🇧🇹" },
        { code: "+591", dialCode: "+591", name: "Bolivia", flag: "🇧🇴" },
        { code: "+387", dialCode: "+387", name: "Bosnia and Herzegovina", flag: "🇧🇦" },
        { code: "+267", dialCode: "+267", name: "Botswana", flag: "🇧🇼" },
        { code: "+55", dialCode: "+55", name: "Brazil", flag: "🇧🇷" },
        { code: "+246", dialCode: "+246", name: "British Indian Ocean Territory", flag: "🇮🇴" },
        { code: "+247", dialCode: "+247", name: "Ascension Island", flag: "🇦🇨" },
        { code: "+1-284", dialCode: "+1284", name: "British Virgin Islands", flag: "🇻🇬" },
        { code: "+673", dialCode: "+673", name: "Brunei", flag: "🇧🇳" },
        { code: "+359", dialCode: "+359", name: "Bulgaria", flag: "🇧🇬" },
        { code: "+226", dialCode: "+226", name: "Burkina Faso", flag: "🇧🇫" },
        { code: "+257", dialCode: "+257", name: "Burundi", flag: "🇧🇮" },
        { code: "+855", dialCode: "+855", name: "Cambodia", flag: "🇰🇭" },
        { code: "+237", dialCode: "+237", name: "Cameroon", flag: "🇨🇲" },
        { code: "+1", dialCode: "+1", name: "Canada", flag: "🇨🇦" },
        { code: "+238", dialCode: "+238", name: "Cape Verde", flag: "🇨🇻" },
        { code: "+1-345", dialCode: "+1345", name: "Cayman Islands", flag: "🇰🇾" },
        { code: "+236", dialCode: "+236", name: "Central African Republic", flag: "🇨🇫" },
        { code: "+235", dialCode: "+235", name: "Chad", flag: "🇹🇩" },
        { code: "+56", dialCode: "+56", name: "Chile", flag: "🇨🇱" },
        { code: "+86", dialCode: "+86", name: "China", flag: "🇨🇳" },
        { code: "+672", dialCode: "+672", name: "Norfolk Island / Antarctic Territories", flag: "🇳🇫" },
        { code: "+57", dialCode: "+57", name: "Colombia", flag: "🇨🇴" },
        { code: "+269", dialCode: "+269", name: "Comoros", flag: "🇰🇲" },
        { code: "+682", dialCode: "+682", name: "Cook Islands", flag: "🇨🇰" },
        { code: "+506", dialCode: "+506", name: "Costa Rica", flag: "🇨🇷" },
        { code: "+385", dialCode: "+385", name: "Croatia", flag: "🇭🇷" },
        { code: "+53", dialCode: "+53", name: "Cuba", flag: "🇨🇺" },
        { code: "+599", dialCode: "+599", name: "Curacao / Caribbean Netherlands", flag: "🇨🇼" },
        { code: "+357", dialCode: "+357", name: "Cyprus", flag: "🇨🇾" },
        { code: "+420", dialCode: "+420", name: "Czech Republic", flag: "🇨🇿" },
        { code: "+243", dialCode: "+243", name: "Democratic Republic of the Congo", flag: "🇨🇩" },
        { code: "+45", dialCode: "+45", name: "Denmark", flag: "🇩🇰" },
        { code: "+253", dialCode: "+253", name: "Djibouti", flag: "🇩🇯" },
        { code: "+1-767", dialCode: "+1767", name: "Dominica", flag: "🇩🇲" },
        { code: "+1-809", dialCode: "+1809", name: "Dominican Republic", flag: "🇩🇴" },
        { code: "+1-829", dialCode: "+1829", name: "Dominican Republic", flag: "🇩🇴" },
        { code: "+1-849", dialCode: "+1849", name: "Dominican Republic", flag: "🇩🇴" },
        { code: "+670", dialCode: "+670", name: "East Timor", flag: "🇹🇱" },
        { code: "+593", dialCode: "+593", name: "Ecuador", flag: "🇪🇨" },
        { code: "+20", dialCode: "+20", name: "Egypt", flag: "🇪🇬" },
        { code: "+503", dialCode: "+503", name: "El Salvador", flag: "🇸🇻" },
        { code: "+240", dialCode: "+240", name: "Equatorial Guinea", flag: "🇬🇶" },
        { code: "+291", dialCode: "+291", name: "Eritrea", flag: "🇪🇷" },
        { code: "+372", dialCode: "+372", name: "Estonia", flag: "🇪🇪" },
        { code: "+251", dialCode: "+251", name: "Ethiopia", flag: "🇪🇹" },
        { code: "+500", dialCode: "+500", name: "Falkland Islands", flag: "🇫🇰" },
        { code: "+298", dialCode: "+298", name: "Faroe Islands", flag: "🇫🇴" },
        { code: "+679", dialCode: "+679", name: "Fiji", flag: "🇫🇯" },
        { code: "+358", dialCode: "+358", name: "Finland", flag: "🇫🇮" },
        { code: "+33", dialCode: "+33", name: "France", flag: "🇫🇷" },
        { code: "+594", dialCode: "+594", name: "French Guiana", flag: "🇬🇫" },
        { code: "+689", dialCode: "+689", name: "French Polynesia", flag: "🇵🇫" },
        { code: "+241", dialCode: "+241", name: "Gabon", flag: "🇬🇦" },
        { code: "+220", dialCode: "+220", name: "Gambia", flag: "🇬🇲" },
        { code: "+995", dialCode: "+995", name: "Georgia", flag: "🇬🇪" },
        { code: "+49", dialCode: "+49", name: "Germany", flag: "🇩🇪" },
        { code: "+233", dialCode: "+233", name: "Ghana", flag: "🇬🇭" },
        { code: "+350", dialCode: "+350", name: "Gibraltar", flag: "🇬🇮" },
        { code: "+30", dialCode: "+30", name: "Greece", flag: "🇬🇷" },
        { code: "+299", dialCode: "+299", name: "Greenland", flag: "🇬🇱" },
        { code: "+1-473", dialCode: "+1473", name: "Grenada", flag: "🇬🇩" },
        { code: "+590", dialCode: "+590", name: "Guadeloupe", flag: "🇬🇵" },
        { code: "+1-671", dialCode: "+1671", name: "Guam", flag: "🇬🇺" },
        { code: "+502", dialCode: "+502", name: "Guatemala", flag: "🇬🇹" },
        { code: "+44-1481", dialCode: "+441481", name: "Guernsey", flag: "🇬🇬" },
        { code: "+224", dialCode: "+224", name: "Guinea", flag: "🇬🇳" },
        { code: "+245", dialCode: "+245", name: "Guinea-Bissau", flag: "🇬🇼" },
        { code: "+592", dialCode: "+592", name: "Guyana", flag: "🇬🇾" },
        { code: "+509", dialCode: "+509", name: "Haiti", flag: "🇭🇹" },
        { code: "+504", dialCode: "+504", name: "Honduras", flag: "🇭🇳" },
        { code: "+852", dialCode: "+852", name: "Hong Kong", flag: "🇭🇰" },
        { code: "+36", dialCode: "+36", name: "Hungary", flag: "🇭🇺" },
        { code: "+354", dialCode: "+354", name: "Iceland", flag: "🇮🇸" },
        { code: "+91", dialCode: "+91", name: "India", flag: "🇮🇳" },
        { code: "+62", dialCode: "+62", name: "Indonesia", flag: "🇮🇩" },
        { code: "+98", dialCode: "+98", name: "Iran", flag: "🇮🇷" },
        { code: "+964", dialCode: "+964", name: "Iraq", flag: "🇮🇶" },
        { code: "+353", dialCode: "+353", name: "Ireland", flag: "🇮🇪" },
        { code: "+44-1624", dialCode: "+441624", name: "Isle of Man", flag: "🇮🇲" },
        { code: "+972", dialCode: "+972", name: "Israel", flag: "🇮🇱" },
        { code: "+39", dialCode: "+39", name: "Italy", flag: "🇮🇹" },
        { code: "+225", dialCode: "+225", name: "Ivory Coast", flag: "🇨🇮" },
        { code: "+1-876", dialCode: "+1876", name: "Jamaica", flag: "🇯🇲" },
        { code: "+81", dialCode: "+81", name: "Japan", flag: "🇯🇵" },
        { code: "+44-1534", dialCode: "+441534", name: "Jersey", flag: "🇯🇪" },
        { code: "+962", dialCode: "+962", name: "Jordan", flag: "🇯🇴" },
        { code: "+7", dialCode: "+7", name: "Kazakhstan", flag: "🇰🇿" },
        { code: "+254", dialCode: "+254", name: "Kenya", flag: "🇰🇪" },
        { code: "+686", dialCode: "+686", name: "Kiribati", flag: "🇰🇮" },
        { code: "+383", dialCode: "+383", name: "Kosovo", flag: "🇽🇰" },
        { code: "+965", dialCode: "+965", name: "Kuwait", flag: "🇰🇼" },
        { code: "+996", dialCode: "+996", name: "Kyrgyzstan", flag: "🇰🇬" },
        { code: "+856", dialCode: "+856", name: "Laos", flag: "🇱🇦" },
        { code: "+371", dialCode: "+371", name: "Latvia", flag: "🇱🇻" },
        { code: "+961", dialCode: "+961", name: "Lebanon", flag: "🇱🇧" },
        { code: "+266", dialCode: "+266", name: "Lesotho", flag: "🇱🇸" },
        { code: "+231", dialCode: "+231", name: "Liberia", flag: "🇱🇷" },
        { code: "+218", dialCode: "+218", name: "Libya", flag: "🇱🇾" },
        { code: "+423", dialCode: "+423", name: "Liechtenstein", flag: "🇱🇮" },
        { code: "+370", dialCode: "+370", name: "Lithuania", flag: "🇱🇹" },
        { code: "+352", dialCode: "+352", name: "Luxembourg", flag: "🇱🇺" },
        { code: "+853", dialCode: "+853", name: "Macau", flag: "🇲🇴" },
        { code: "+389", dialCode: "+389", name: "Macedonia", flag: "🇲🇰" },
        { code: "+261", dialCode: "+261", name: "Madagascar", flag: "🇲🇬" },
        { code: "+265", dialCode: "+265", name: "Malawi", flag: "🇲🇼" },
        { code: "+60", dialCode: "+60", name: "Malaysia", flag: "🇲🇾" },
        { code: "+960", dialCode: "+960", name: "Maldives", flag: "🇲🇻" },
        { code: "+223", dialCode: "+223", name: "Mali", flag: "🇲🇱" },
        { code: "+356", dialCode: "+356", name: "Malta", flag: "🇲🇹" },
        { code: "+692", dialCode: "+692", name: "Marshall Islands", flag: "🇲🇭" },
        { code: "+596", dialCode: "+596", name: "Martinique", flag: "🇲🇶" },
        { code: "+222", dialCode: "+222", name: "Mauritania", flag: "🇲🇷" },
        { code: "+230", dialCode: "+230", name: "Mauritius", flag: "🇲🇺" },
        { code: "+262", dialCode: "+262", name: "Mayotte", flag: "🇾🇹" },
        { code: "+52", dialCode: "+52", name: "Mexico", flag: "🇲🇽" },
        { code: "+691", dialCode: "+691", name: "Micronesia", flag: "🇫🇲" },
        { code: "+373", dialCode: "+373", name: "Moldova", flag: "🇲🇩" },
        { code: "+377", dialCode: "+377", name: "Monaco", flag: "🇲🇨" },
        { code: "+976", dialCode: "+976", name: "Mongolia", flag: "🇲🇳" },
        { code: "+382", dialCode: "+382", name: "Montenegro", flag: "🇲🇪" },
        { code: "+1-664", dialCode: "+1664", name: "Montserrat", flag: "🇲🇸" },
        { code: "+212", dialCode: "+212", name: "Morocco", flag: "🇲🇦" },
        { code: "+258", dialCode: "+258", name: "Mozambique", flag: "🇲🇿" },
        { code: "+95", dialCode: "+95", name: "Myanmar", flag: "🇲🇲" },
        { code: "+264", dialCode: "+264", name: "Namibia", flag: "🇳🇦" },
        { code: "+674", dialCode: "+674", name: "Nauru", flag: "🇳🇷" },
        { code: "+977", dialCode: "+977", name: "Nepal", flag: "🇳🇵" },
        { code: "+31", dialCode: "+31", name: "Netherlands", flag: "🇳🇱" },
        { code: "+687", dialCode: "+687", name: "New Caledonia", flag: "🇳🇨" },
        { code: "+64", dialCode: "+64", name: "New Zealand", flag: "🇳🇿" },
        { code: "+505", dialCode: "+505", name: "Nicaragua", flag: "🇳🇮" },
        { code: "+227", dialCode: "+227", name: "Niger", flag: "🇳🇪" },
        { code: "+234", dialCode: "+234", name: "Nigeria", flag: "🇳🇬" },
        { code: "+683", dialCode: "+683", name: "Niue", flag: "🇳🇺" },
        { code: "+850", dialCode: "+850", name: "North Korea", flag: "🇰🇵" },
        { code: "+1-670", dialCode: "+1670", name: "Northern Mariana Islands", flag: "🇲🇵" },
        { code: "+47", dialCode: "+47", name: "Norway", flag: "🇳🇴" },
        { code: "+968", dialCode: "+968", name: "Oman", flag: "🇴🇲" },
        { code: "+92", dialCode: "+92", name: "Pakistan", flag: "🇵🇰" },
        { code: "+680", dialCode: "+680", name: "Palau", flag: "🇵🇼" },
        { code: "+970", dialCode: "+970", name: "Palestine", flag: "🇵🇸" },
        { code: "+507", dialCode: "+507", name: "Panama", flag: "🇵🇦" },
        { code: "+675", dialCode: "+675", name: "Papua New Guinea", flag: "🇵🇬" },
        { code: "+595", dialCode: "+595", name: "Paraguay", flag: "🇵🇾" },
        { code: "+51", dialCode: "+51", name: "Peru", flag: "🇵🇪" },
        { code: "+63", dialCode: "+63", name: "Philippines", flag: "🇵🇭" },
        { code: "+48", dialCode: "+48", name: "Poland", flag: "🇵🇱" },
        { code: "+351", dialCode: "+351", name: "Portugal", flag: "🇵🇹" },
        { code: "+1-787", dialCode: "+1787", name: "Puerto Rico", flag: "🇵🇷" },
        { code: "+1-939", dialCode: "+1939", name: "Puerto Rico", flag: "🇵🇷" },
        { code: "+974", dialCode: "+974", name: "Qatar", flag: "🇶🇦" },
        { code: "+242", dialCode: "+242", name: "Republic of the Congo", flag: "🇨🇬" },
        { code: "+262", dialCode: "+262", name: "Reunion", flag: "🇷🇪" },
        { code: "+40", dialCode: "+40", name: "Romania", flag: "🇷🇴" },
        { code: "+7", dialCode: "+7", name: "Russia", flag: "🇷🇺" },
        { code: "+250", dialCode: "+250", name: "Rwanda", flag: "🇷🇼" },
        { code: "+290", dialCode: "+290", name: "Saint Helena", flag: "🇸🇭" },
        { code: "+1-869", dialCode: "+1869", name: "Saint Kitts and Nevis", flag: "🇰🇳" },
        { code: "+1-758", dialCode: "+1758", name: "Saint Lucia", flag: "🇱🇨" },
        { code: "+508", dialCode: "+508", name: "Saint Pierre and Miquelon", flag: "🇵🇲" },
        { code: "+1-784", dialCode: "+1784", name: "Saint Vincent and the Grenadines", flag: "🇻🇨" },
        { code: "+685", dialCode: "+685", name: "Samoa", flag: "🇼🇸" },
        { code: "+378", dialCode: "+378", name: "San Marino", flag: "🇸🇲" },
        { code: "+239", dialCode: "+239", name: "Sao Tome and Principe", flag: "🇸🇹" },
        { code: "+966", dialCode: "+966", name: "Saudi Arabia", flag: "🇸🇦" },
        { code: "+221", dialCode: "+221", name: "Senegal", flag: "🇸🇳" },
        { code: "+381", dialCode: "+381", name: "Serbia", flag: "🇷🇸" },
        { code: "+248", dialCode: "+248", name: "Seychelles", flag: "🇸🇨" },
        { code: "+232", dialCode: "+232", name: "Sierra Leone", flag: "🇸🇱" },
        { code: "+65", dialCode: "+65", name: "Singapore", flag: "🇸🇬" },
        { code: "+1-721", dialCode: "+1721", name: "Sint Maarten", flag: "🇸🇽" },
        { code: "+421", dialCode: "+421", name: "Slovakia", flag: "🇸🇰" },
        { code: "+386", dialCode: "+386", name: "Slovenia", flag: "🇸🇮" },
        { code: "+677", dialCode: "+677", name: "Solomon Islands", flag: "🇸🇧" },
        { code: "+252", dialCode: "+252", name: "Somalia", flag: "🇸🇴" },
        { code: "+27", dialCode: "+27", name: "South Africa", flag: "🇿🇦" },
        { code: "+82", dialCode: "+82", name: "South Korea", flag: "🇰🇷" },
        { code: "+211", dialCode: "+211", name: "South Sudan", flag: "🇸🇸" },
        { code: "+34", dialCode: "+34", name: "Spain", flag: "🇪🇸" },
        { code: "+94", dialCode: "+94", name: "Sri Lanka", flag: "🇱🇰" },
        { code: "+249", dialCode: "+249", name: "Sudan", flag: "🇸🇩" },
        { code: "+597", dialCode: "+597", name: "Suriname", flag: "🇸🇷" },
        { code: "+47", dialCode: "+47", name: "Svalbard and Jan Mayen", flag: "🇸🇯" },
        { code: "+268", dialCode: "+268", name: "Swaziland", flag: "🇸🇿" },
        { code: "+46", dialCode: "+46", name: "Sweden", flag: "🇸🇪" },
        { code: "+41", dialCode: "+41", name: "Switzerland", flag: "🇨🇭" },
        { code: "+963", dialCode: "+963", name: "Syria", flag: "🇸🇾" },
        { code: "+886", dialCode: "+886", name: "Taiwan", flag: "🇹🇼" },
        { code: "+992", dialCode: "+992", name: "Tajikistan", flag: "🇹🇯" },
        { code: "+255", dialCode: "+255", name: "Tanzania", flag: "🇹🇿" },
        { code: "+66", dialCode: "+66", name: "Thailand", flag: "🇹🇭" },
        { code: "+228", dialCode: "+228", name: "Togo", flag: "🇹🇬" },
        { code: "+690", dialCode: "+690", name: "Tokelau", flag: "🇹🇰" },
        { code: "+676", dialCode: "+676", name: "Tonga", flag: "🇹🇴" },
        { code: "+1-868", dialCode: "+1868", name: "Trinidad and Tobago", flag: "🇹🇹" },
        { code: "+216", dialCode: "+216", name: "Tunisia", flag: "🇹🇳" },
        { code: "+90", dialCode: "+90", name: "Turkey", flag: "🇹🇷" },
        { code: "+993", dialCode: "+993", name: "Turkmenistan", flag: "🇹🇲" },
        { code: "+1-649", dialCode: "+1649", name: "Turks and Caicos Islands", flag: "🇹🇨" },
        { code: "+688", dialCode: "+688", name: "Tuvalu", flag: "🇹🇻" },
        { code: "+256", dialCode: "+256", name: "Uganda", flag: "🇺🇬" },
        { code: "+380", dialCode: "+380", name: "Ukraine", flag: "🇺🇦" },
        { code: "+971", dialCode: "+971", name: "United Arab Emirates", flag: "🇦🇪" },
        { code: "+44", dialCode: "+44", name: "United Kingdom", flag: "🇬🇧" },
        { code: "+1", dialCode: "+1", name: "United States", flag: "🇺🇸" },
        { code: "+598", dialCode: "+598", name: "Uruguay", flag: "🇺🇾" },
        { code: "+998", dialCode: "+998", name: "Uzbekistan", flag: "🇺🇿" },
        { code: "+678", dialCode: "+678", name: "Vanuatu", flag: "🇻🇺" },
        { code: "+379", dialCode: "+379", name: "Vatican", flag: "🇻🇦" },
        { code: "+58", dialCode: "+58", name: "Venezuela", flag: "🇻🇪" },
        { code: "+84", dialCode: "+84", name: "Vietnam", flag: "🇻🇳" },
        { code: "+681", dialCode: "+681", name: "Wallis and Futuna", flag: "🇼🇫" },
        { code: "+212", dialCode: "+212", name: "Western Sahara", flag: "🇪🇭" },
        { code: "+967", dialCode: "+967", name: "Yemen", flag: "🇾🇪" },
        { code: "+260", dialCode: "+260", name: "Zambia", flag: "🇿🇲" },
        { code: "+263", dialCode: "+263", name: "Zimbabwe", flag: "🇿🇼" },
      ],
      paymentMethod: "card",
      termsAccepted: false,
    };
  },
  async mounted() {
    this.startCountdown();
    
    const gateways = getAvailablePaymentGateways(this.cartCurrency);
    if (gateways && gateways.length > 0) {
      this.selectedPaymentGateway = gateways[0];
    }
  },
  computed: {
    ...mapGetters({
      getCart: "getCart",
      getCartTotal: "getCartTotal",
      getCartSubTotal: "getCartSubTotal",
      getCartServiceCharge: "getCartServiceCharge",
      getContactInfo: "getContactInfo",
    }),
    progressWidth() {
      if (this.steps.length <= 1) return "0%";
      const progress = (this.currentStep / (this.steps.length - 1)) * 100;
      return `${progress}%`;
    },
    processedCountryCodes() {
      const seen = new Set();
      return this.countryCodes.filter(country => {
        if (seen.has(country.dialCode)) {
          return false;
        }
        seen.add(country.dialCode);
        return true;
      });
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
    rawSubtotal() {
      return this.getCart.reduce((total, product) => {
        return (
          total +
          product.event.tickets.reduce((productTotal, ticket) => {
            return productTotal + (ticket.selectedQuantity || 0) * ticket.price;
          }, 0)
        );
      }, 0);
    },
    discount() {
      if (!this.discountResult || !this.discountResult.discountValue) {
        return 0;
      }
      return this.discountResult.discountValue;
    },
    subTotal() {
      return Math.max(0, this.rawSubtotal - this.discount);
    },
    serviceCharge() {
      return this.subTotal * 0.075;
    },
    cartTotal() {
      return this.subTotal + this.serviceCharge;
    },
    cartCurrency() {
      if (this.getCart.length === 0) return "NGN";
      
      for (const product of this.getCart) {
        const selectedTicket = product.event?.tickets?.find(
          ticket => ticket.selectedQuantity > 0
        );
        if (selectedTicket?.currency) {
          return selectedTicket.currency;
        }
      }
      
      const firstTicket = this.getCart[0]?.event?.tickets?.[0];
      return firstTicket?.currency || "NGN";
    },
    selectedTickets() {
      const tickets = [];
      this.getCart.forEach((product) => {
        product.event.tickets.forEach((ticket) => {
          if (ticket.selectedQuantity && ticket.selectedQuantity > 0) {
            tickets.push({
              name: ticket.name,
              quantity: ticket.selectedQuantity,
              price: ticket.price,
            });
          }
        });
      });
      return tickets;
    },
    hasSelectedTickets() {
      return this.selectedTickets.length > 0;
    },
    availablePaymentGateways() {
      return getAvailablePaymentGateways(this.cartCurrency);
    },
    paymentGateway() {
      if (this.selectedPaymentGateway && this.availablePaymentGateways.includes(this.selectedPaymentGateway)) {
        return this.selectedPaymentGateway;
      }
      return getPaymentGateway(this.cartCurrency);
    },
    hasMultipleGateways() {
      return this.availablePaymentGateways.length > 1;
    },
  },
  watch: {
    "contact.confirmEmail": function (newVal) {
      this.emailMismatch =
        this.contact.email !== "" &&
        newVal !== "" &&
        this.contact.email !== newVal;
    },
    "contact.email": function () {
      this.emailMismatch =
        this.contact.email !== "" &&
        this.contact.confirmEmail !== "" &&
        this.contact.email !== this.contact.confirmEmail;
    },
    availablePaymentGateways(newGateways) {
      if (!newGateways || newGateways.length === 0) return;
      
      if (!this.selectedPaymentGateway || !newGateways.includes(this.selectedPaymentGateway)) {
        this.selectedPaymentGateway = newGateways[0];
        this.isGatewayManuallySelected = false;
      }
    }
  },
  beforeDestroy() {
    if (this.countdown) {
      clearInterval(this.countdown);
    }
  },
  methods: {
    ...mapMutations(["setContactInfo"]),
    formatPrice,
    getCurrencySymbol,
    selectGateway(gateway) {
      this.selectedPaymentGateway = gateway;
      this.isGatewayManuallySelected = true;
      console.log("✅ User manually selected gateway:", gateway);
    },
    startCountdown() {
      let minutes = 10;
      let seconds = 0;
      this.countdown = setInterval(() => {
        if (seconds === 0) {
          if (minutes === 0) {
            clearInterval(this.countdown);
            this.timer = "00:00";
            alert("Time's up! Please refresh to try again.");
            return;
          }
          minutes--;
          seconds = 59;
        } else {
          seconds--;
        }
        this.timer = `${minutes.toString().padStart(2, "0")}:${seconds
          .toString()
          .padStart(2, "0")}`;
      }, 1000);
    },
    nextStep() {
      if (this.currentStep === 1) {
        this.setContactInfo(this.contact);
      }
      if (this.currentStep < this.steps.length - 1) {
        this.currentStep++;
      }
    },
    prevStep() {
      if (this.currentStep > 0) {
        this.currentStep--;
      }
    },
    async applyPromo() {
      if (!this.promoCode || this.promoCode.trim() === "") {
        this.discountResult = { message: "Please enter a promo code." };
        return;
      }
      try {
        const response = await axios.post(
          `${process.env.VUE_APP_BASE_URL}/promo/validate`,
          {
            code: this.promoCode,
            subtotal: this.rawSubtotal,
          }
        );
        this.discountResult = response.data;
      } catch (error) {
        this.discountResult = {
          message:
            error.response?.data?.message || "Invalid or expired promo code.",
        };
      }
    },
    async initializePayment() {
      console.log("💳 Initializing payment...");
      console.log("  Currency:", this.cartCurrency);
      console.log("  Available Gateways:", this.availablePaymentGateways);
      console.log("  Selected Gateway:", this.selectedPaymentGateway);
      console.log("  Active Gateway:", this.paymentGateway);
      
      this.spinner = true;
      try {
        if (this.paymentGateway === "paystack") {
          console.log("✅ Proceeding with Paystack");
          this.handlePaystackPayment();
        } else if (this.paymentGateway === "fincra") {
          console.log("✅ Proceeding with Fincra");
          await this.handleFincraPayment();
        } else {
          console.error("Unknown payment gateway:", this.paymentGateway, "for currency:", this.cartCurrency);
          alert(`Payment gateway not available for ${this.cartCurrency}. Please contact support or try a different currency.`);
          this.spinner = false;
        }
      } catch (error) {
        console.error("Payment initialization error:", error);
        alert("Payment initialization failed. Please try again or contact support.");
        this.spinner = false;
      }
    },
    async handlePaystackPayment() {
      try {
        console.log("🔵 Starting Paystack payment initialization...");
        console.log("Backend URL:", process.env.VUE_APP_BASE_URL);
        
        const selectedTickets = this.getCart.flatMap((product) =>
          product.event.tickets
            .filter((ticket) => ticket.selectedQuantity > 0)
            .map((ticket) => ({
              name: ticket.name,
              quantity: ticket.selectedQuantity,
              type: ticket.type,
            }))
        );

        const affiliate = localStorage.getItem("affiliateCode");

        const orderData = {
          startDate: this.getCart[0]?.event?.start,
          startTime: this.getCart[0]?.event?.startTime,
          location: this.getCart[0]?.event?.location?.name,
          userId: this.getCart[0]?.user,
          productId: this.getCart[0]?.id,
          title: this.getCart[0]?.title,
          contact: {
            name: `${this.contact.firstName} ${this.contact.lastName}`,
            email: this.contact.email,
            phone: `${this.contact.countryCode}${this.contact.phone}`,
          },
          tickets: selectedTickets,
          price: this.subTotal,
          currency: this.cartCurrency,
          affiliate,
          promoCode: this.promoCode,
        };

        const payload = {
          email: this.contact.email,
          amount: this.cartTotal,
          currency: this.cartCurrency,
          metadata: { orderData },
        };

        console.log("📤 Sending Paystack initialization request:", payload);
        console.log("📍 Endpoint:", `${process.env.VUE_APP_BASE_URL}/api/initialize`);

        const response = await axios.post(
          `${process.env.VUE_APP_BASE_URL}/api/initialize`,
          payload
        );

        console.log("✅ Paystack initialization response:", response.data);

        const { authorization_url, reference } = response.data.data;
        localStorage.setItem("paystack_reference", reference);
        localStorage.setItem("cartTotal", this.cartTotal);
        localStorage.setItem("startDate", this.getCart[0]?.event?.start);
        localStorage.setItem("startTime", this.getCart[0]?.event?.startTime);
        localStorage.setItem("location", this.getCart[0]?.event?.location?.name);

        this.spinner = false;
        window.location.href = authorization_url;
      } catch (error) {
        console.error("❌ Paystack initialization error:", error);
        console.error("❌ Error response:", error.response?.data);
        console.error("❌ Error status:", error.response?.status);
        alert(`Failed to initialize payment: ${error.response?.data?.error || error.message}`);
        this.spinner = false;
      }
    },
    async handleFincraPayment() {
      try {
        const selectedTickets = this.getCart.flatMap((product) =>
          product.event.tickets
            .filter((ticket) => ticket.selectedQuantity > 0)
            .map((ticket) => ({
              name: ticket.name,
              quantity: ticket.selectedQuantity,
              type: ticket.type,
            }))
        );

        const affiliate = localStorage.getItem("affiliateCode");

        const orderData = {
          startDate: this.getCart[0]?.event?.start,
          startTime: this.getCart[0]?.event?.startTime,
          location: this.getCart[0]?.event?.location?.name,
          userId: this.getCart[0]?.user,
          productId: this.getCart[0]?.id,
          title: this.getCart[0]?.title,
          contact: {
            name: `${this.contact.firstName} ${this.contact.lastName}`,
            email: this.contact.email,
            phone: `${this.contact.countryCode}${this.contact.phone}`,
          },
          tickets: selectedTickets,
          price: this.subTotal,
          currency: this.cartCurrency,
          affiliate,
          promoCode: this.promoCode,
        };

        const response = await axios.post(
          `${process.env.VUE_APP_BASE_URL}/api/fincra/create-checkout`,
          {
            amount: this.cartTotal,
            currency: this.cartCurrency,
            email: this.contact.email,
            metadata: { orderData },
          }
        );
        
        if (response.data && response.data.data && response.data.data.checkout_url) {
          this.spinner = false;
          window.location.href = response.data.data.checkout_url;
        } else {
          console.error("Invalid Fincra response:", response.data);
          alert("Failed to initialize Fincra payment. Please try again.");
          this.spinner = false;
        }
      } catch (error) {
        console.error("Fincra payment error:", error);
        alert("Failed to initialize Fincra payment. Please try again.");
        this.spinner = false;
      }
    },
    async onSuccessfulPayment(reference) {
      try {
        const response = await axios.post(
          `${process.env.VUE_APP_BASE_URL}/payment/verify/${reference}`
        );
        if (response.data.status === "success") {
          this.$router.push("/success");
        } else {
          alert("Payment verification failed. Please contact support.");
          this.spinner = false;
        }
      } catch (error) {
        console.error("Payment verification error:", error);
        this.spinner = false;
      }
    },
    generateReference() {
      let text = "";
      const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      for (let i = 0; i < 10; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
      }
      return text;
    },
    async getTicket() {
      try {
        console.log("🟢 Starting free ticket order (getTicket method)...");
        console.log("Backend URL:", process.env.VUE_APP_BASE_URL);
        
        this.reference = this.generateReference();
        localStorage.setItem("paystack_reference", this.reference);
        this.spinner = true;
        const affiliate = localStorage.getItem("affiliateCode");

        const selectedTickets = this.getCart.flatMap((product) =>
          product.event.tickets
            .filter((ticket) => ticket.selectedQuantity > 0)
            .map((ticket) => ({
              name: ticket.name,
              quantity: ticket.selectedQuantity,
              type: ticket.type,
            }))
        );

        const payload = {
          startDate: this.getCart[0]?.event?.start,
          startTime: this.getCart[0]?.event?.startTime,
          location: this.getCart[0]?.event?.location?.name,
          reference: this.reference,
          userId: this.getCart[0]?.user,
          productId: this.getCart[0]?.id,
          title: this.getCart[0]?.title,
          contact: {
            name: `${this.contact.firstName} ${this.contact.lastName}`,
            email: this.contact.email,
            phone: `${this.contact.countryCode}${this.contact.phone}`,
          },
          tickets: selectedTickets,
          price: this.subTotal,
          currency: this.cartCurrency,
          affiliate,
          promoCode: this.promoCode,
        };

        console.log("📤 Sending free ticket order:", payload);
        console.log("📍 Endpoint:", `${process.env.VUE_APP_BASE_URL}/api/order`);
        
        const res = await axios.post(
          `${process.env.VUE_APP_BASE_URL}/api/order`,
          payload
        );
        
        console.log("✅ Free ticket order response:", res.data);
        
        this.spinner = false;
        alert("Your ticket has been confirmed, check your email inbox & spam for booking confirmation");
        this.$router.push({ name: "home" });
      } catch (err) {
        console.error("❌ Failed to get free ticket:", err);
        console.error("❌ Error response:", err.response?.data);
        console.error("❌ Error status:", err.response?.status);
        alert(`Failed to get free tickets: ${err.response?.data?.error || err.message}`);
        this.spinner = false;
      }
    },
  },
};
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.checkout-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  padding: 2rem 0;
}

@media (max-width: 768px) {
  .checkout-container {
    padding: 0;
    background: #f8f9fa;
  }
}

.checkout-wrapper {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: 2rem;
}

@media (max-width: 991px) {
  .checkout-wrapper {
    grid-template-columns: 1fr;
    padding: 0;
  }
}

/* Mobile Price Footer */
.mobile-price-footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #047143 !important;
  padding: 1rem;
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
}

.mobile-price-content {
  text-align: center;
  color: white !important;
}

.mobile-price-content small {
  font-size: 0.85rem;
  opacity: 0.9;
}

.mobile-total {
  font-size: 1.25rem;
  font-weight: 700;
  margin-top: 0.25rem;
  color: white !important;
}

/* Main Checkout Area */
.checkout-main {
  background: white;
  border-radius: 24px;
  padding: 2.5rem;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.08);
}

@media (max-width: 768px) {
  .checkout-main {
    padding: 1.25rem 1rem;
    margin-bottom: 100px;
    border-radius: 0;
    box-shadow: none;
  }
}

/* Enhanced Progress Stepper - Override all Bootstrap wizard styles */
.progress-stepper {
  position: relative;
  display: flex;
  justify-content: space-between;
  margin-bottom: 2.5rem;
  padding: 0 0.5rem;
  background: transparent !important;
  border: none !important;
  box-shadow: none !important;
}

@media (max-width: 768px) {
  .progress-stepper {
    margin-bottom: 1.5rem;
    padding: 0 0.25rem;
  }
}

/* Force override any Bootstrap .wizard or .steps classes */
.wizard,
.steps,
.wizard > .steps,
.wizard > .steps > ul,
.wizard > .steps > ul > li {
  background: transparent !important;
  background-color: transparent !important;
  border: none !important;
  box-shadow: none !important;
}

.stepper-track {
  position: absolute;
  top: 24px;
  left: 15%;
  right: 15%;
  height: 3px;
  background: #e9ecef;
  border-radius: 10px;
  z-index: 1;
}

.stepper-progress {
  position: absolute;
  top: 24px;
  left: 15%;
  height: 3px;
  background: linear-gradient(90deg, #047143 0%, #f4a213 100%);
  border-radius: 10px;
  transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 2;
}

@media (max-width: 768px) {
  .stepper-track,
  .stepper-progress {
    top: 18px;
    height: 2px;
  }
}

.step-item {
  position: relative;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 3;
  background: transparent !important;
  background-color: transparent !important;
  border: none !important;
  padding: 0 !important;
  margin: 0 !important;
  width: auto !important;
  min-width: 0 !important;
  box-shadow: none !important;
}

.step-item.active {
  background: transparent !important;
  background-color: transparent !important;
  border: none !important;
  box-shadow: none !important;
}

.step-item.completed {
  background: transparent !important;
  background-color: transparent !important;
  border: none !important;
  box-shadow: none !important;
}

.step-indicator {
  width: 45px;
  height: 45px;
  min-width: 45px;
  min-height: 45px;
  border-radius: 50% !important;
  background: white !important;
  border: 3px solid #dee2e6 !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  font-weight: 700;
  font-size: 0.95rem;
  color: #adb5bd !important;
  margin: 0 auto 0.5rem !important;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08) !important;
  padding: 0 !important;
  line-height: 1 !important;
}

@media (max-width: 768px) {
  .step-indicator {
    width: 40px !important;
    height: 40px !important;
    min-width: 40px !important;
    min-height: 40px !important;
    font-size: 0.8rem;
    border-width: 2px !important;
    margin-bottom: 0.4rem !important;
  }
}

.step-item.active .step-indicator {
  background: #f4a213 !important;
  border-color: #f4a213 !important;
  color: white !important;
  transform: none !important;
  box-shadow: 0 4px 16px rgba(244, 162, 19, 0.3) !important;
}

.step-item.completed .step-indicator {
  background: #047143 !important;
  border-color: #047143 !important;
  color: white !important;
  transform: none !important;
  box-shadow: 0 3px 12px rgba(4, 113, 67, 0.25) !important;
}

.checkmark {
  font-size: 1rem;
  line-height: 1 !important;
  display: block !important;
}

@media (max-width: 768px) {
  .checkmark {
    font-size: 0.85rem;
  }
}

.step-number {
  font-size: 0.95rem;
  line-height: 1 !important;
  display: block !important;
}

@media (max-width: 768px) {
  .step-number {
    font-size: 0.8rem;
  }
}

.step-label {
  font-size: 0.85rem;
  font-weight: 500;
  color: #6c757d;
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 0.3px;
  transition: all 0.3s ease;
}

@media (max-width: 768px) {
  .step-label {
    font-size: 0.7rem;
    letter-spacing: 0.2px;
  }
}

.step-item.active .step-label {
  color: #f4a213 !important;
  font-weight: 700;
}

.step-item.completed .step-label {
  color: #047143 !important;
  font-weight: 600;
}

/* Content Section */
.content-section {
  margin-top: 1rem;
}

@media (max-width: 768px) {
  .content-section {
    margin-top: 0.75rem;
  }
}

.section-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 1.5rem;
  letter-spacing: -0.5px;
}

@media (max-width: 768px) {
  .section-title {
    font-size: 1.35rem;
    margin-bottom: 1.25rem;
  }
}

/* Tickets List */
.tickets-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

@media (max-width: 768px) {
  .tickets-list {
    gap: 0.75rem;
  }
}

.ticket-item {
  background: white;
  border: 2px solid #e9ecef;
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.3s ease;
}

@media (max-width: 768px) {
  .ticket-item {
    padding: 1rem;
    border-radius: 10px;
  }
}

.ticket-item:hover {
  border-color: #f4a213;
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.08);
  transform: translateY(-2px);
}

.ticket-details {
  flex: 1;
}

.ticket-name {
  font-size: 1.2rem;
  font-weight: 600;
  color: #2c3e50;
  margin: 0 0 0.5rem 0;
}

.ticket-price {
  font-size: 1.15rem;
  font-weight: 700;
  color: #f4a213;
  margin: 0;
}

.ticket-selector {
  margin-left: 1rem;
}

.quantity-select {
  padding: 0.75rem 1rem;
  font-size: 1rem;
  font-weight: 600;
  border: 2px solid #e9ecef;
  border-radius: 12px;
  background: white;
  color: #2c3e50;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 80px;
}

.quantity-select:hover {
  border-color: #f4a213;
}

.quantity-select:focus {
  outline: none;
  border-color: #f4a213;
  box-shadow: 0 0 0 4px rgba(244, 162, 19, 0.1);
}

.sold-out-badge {
  background: #dc3545;
  color: white;
  padding: 0.6rem 1.2rem;
  border-radius: 12px;
  font-weight: 700;
  font-size: 0.9rem;
}

/* Contact Form */
.contact-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

@media (max-width: 768px) {
  .contact-form {
    gap: 1rem;
  }
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.25rem;
}

@media (max-width: 768px) {
  .form-row {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
}

.form-group {
  display: flex;
  flex-direction: column;
}

.input-label {
  font-weight: 600;
  color: #495057;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
}

@media (max-width: 768px) {
  .input-label {
    font-size: 0.85rem;
    margin-bottom: 0.4rem;
  }
}

.form-input {
  padding: 0.85rem 1rem;
  font-size: 0.95rem;
  border: 2px solid #e9ecef;
  border-radius: 10px;
  background: white;
  color: #2c3e50;
  transition: all 0.3s ease;
}

@media (max-width: 768px) {
  .form-input {
    padding: 0.75rem 0.9rem;
    font-size: 0.9rem;
    border-radius: 8px;
  }
}

.form-input:focus {
  outline: none;
  border-color: #f4a213 !important;
  box-shadow: 0 0 0 3px rgba(244, 162, 19, 0.1) !important;
}

.form-input::placeholder {
  color: #adb5bd;
}

/* Phone Input - PERFECTLY ALIGNED */
.phone-group {
  margin-top: 0.5rem;
}

.phone-input-wrapper {
  display: flex;
  gap: 0;
  align-items: stretch;
}

.country-select {
  flex: 0 0 auto;
  width: 130px;
  padding: 0.85rem 0.7rem;
  font-size: 0.9rem;
  font-weight: 600;
  border: 2px solid #e9ecef;
  border-right: none;
  border-top-left-radius: 10px;
  border-bottom-left-radius: 10px;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
  background: #f8f9fa;
  color: #2c3e50;
  cursor: pointer;
  transition: all 0.3s ease;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23495057' d='M6 9L1 4h10z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.65rem center;
  padding-right: 2rem;
}

@media (max-width: 768px) {
  .country-select {
    width: 115px;
    padding: 0.75rem 0.6rem;
    font-size: 0.85rem;
    border-radius: 8px;
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
    padding-right: 1.75rem;
    background-position: right 0.5rem center;
  }
}

.phone-input {
  flex: 1 1 auto;
  padding: 0.85rem 1rem;
  font-size: 0.95rem;
  border: 2px solid #e9ecef;
  border-left: none;
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
  border-top-right-radius: 10px;
  border-bottom-right-radius: 10px;
  background: white;
  color: #2c3e50;
  transition: all 0.3s ease;
}

@media (max-width: 768px) {
  .phone-input {
    padding: 0.75rem 0.9rem;
    font-size: 0.9rem;
    border-radius: 8px;
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }
}

.phone-input:focus {
  outline: none;
  border-color: #f4a213 !important;
}

.phone-input-wrapper:focus-within .country-select {
  border-color: #f4a213 !important;
  background: white;
}

.phone-input-wrapper:focus-within .phone-input {
  border-color: #f4a213 !important;
  box-shadow: 0 0 0 3px rgba(244, 162, 19, 0.1) !important;
}

.error-message {
  color: #dc3545;
  font-size: 0.9rem;
  font-weight: 500;
  margin-top: -0.5rem;
  padding: 0.5rem;
  background: #fff5f5;
  border-radius: 8px;
  border-left: 3px solid #dc3545;
}

/* Payment Section */
.timer-alert {
  background: #fff3cd;
  border: 2px solid #ffc107;
  border-radius: 12px;
  color: #856404;
  font-weight: 600;
  padding: 1rem 1.25rem;
  margin-bottom: 1.5rem;
}

/* Gateway Selection */
.gateway-selection {
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: #f8f9fa;
  border-radius: 16px;
  border: 2px solid #e9ecef;
}

.gateway-instruction {
  font-size: 1rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 1rem;
}

.gateway-options {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.gateway-option {
  flex: 1;
  min-width: 200px;
  padding: 1.25rem;
  background: white;
  border: 3px solid #dee2e6;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
}

.gateway-option:hover {
  border-color: #f4a213;
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(244, 162, 19, 0.2);
}

.gateway-option.selected {
  border-color: #047143;
  background: #e8f5e9;
  box-shadow: 0 4px 16px rgba(4, 113, 67, 0.2);
}

.gateway-radio {
  margin-right: 0.75rem;
  width: 20px;
  height: 20px;
  cursor: pointer;
  accent-color: #047143;
}

.gateway-label {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex: 1;
  cursor: pointer;
  margin: 0;
}

.gateway-name {
  font-size: 1.1rem;
  font-weight: 700;
  color: #2c3e50;
}

.gateway-badge {
  font-size: 1.5rem;
  margin-left: 0.5rem;
}

@media (max-width: 768px) {
  .gateway-options {
    flex-direction: column;
  }
  
  .gateway-option {
    min-width: 100%;
  }
}

.payment-option {
  margin-bottom: 1.5rem;
  padding: 1.25rem;
  border: 2px solid #e9ecef;
  border-radius: 12px;
  transition: all 0.3s ease;
}

.payment-option:hover {
  border-color: #f4a213;
}

.payment-radio {
  margin-right: 0.75rem;
  width: 20px;
  height: 20px;
  cursor: pointer;
}

.payment-label {
  font-size: 1.05rem;
  font-weight: 600;
  color: #2c3e50;
  cursor: pointer;
}

.payment-form {
  margin-top: 1rem;
}

.terms-wrapper {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 1.25rem;
  background: #f8f9fa;
  border-radius: 12px;
  margin-top: 1rem;
}

.terms-checkbox {
  width: 20px;
  height: 20px;
  margin-top: 2px;
  cursor: pointer;
  flex-shrink: 0;
}

.terms-label {
  font-size: 0.95rem;
  color: #495057;
  line-height: 1.5;
  cursor: pointer;
}

.terms-label a {
  color: #f4a213;
  text-decoration: none;
  font-weight: 600;
}

.terms-label a:hover {
  text-decoration: underline;
}

/* Navigation Buttons */
.nav-buttons {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 2px solid #e9ecef;
}

@media (max-width: 768px) {
  .nav-buttons {
    flex-direction: column;
    gap: 0.75rem;
    margin-top: 1.5rem;
    padding-top: 1.25rem;
    justify-content: center !important;
    align-items: center !important;
  }
}

.nav-btn {
  flex: 1;
  max-width: 200px;
  padding: 0.85rem 1.5rem;
  font-size: 0.9rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.4px;
  border: none !important;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
}

@media (max-width: 768px) {
  .nav-btn {
    max-width: 85% !important;
    width: 85% !important;
    padding: 0.8rem 1.25rem;
    font-size: 0.85rem;
    letter-spacing: 0.3px;
    border-radius: 8px;
  }
}

.back-btn {
  background: #dc3545 !important;
  color: white !important;
  box-shadow: 0 4px 16px rgba(220, 53, 69, 0.25);
}

.back-btn:hover:not(:disabled) {
  background: #c82333 !important;
  transform: translateY(-2px);
  box-shadow: 0 6px 24px rgba(220, 53, 69, 0.35);
}

.next-btn,
.get-tickets-btn {
  background: #f4a213 !important;
  color: white !important;
  box-shadow: 0 4px 16px rgba(244, 162, 19, 0.25);
}

.next-btn:hover:not(:disabled),
.get-tickets-btn:hover:not(:disabled) {
  background: #d68910 !important;
  transform: translateY(-2px);
  box-shadow: 0 6px 24px rgba(244, 162, 19, 0.35);
}

.pay-btn {
  background: #047143 !important;
  color: white !important;
  box-shadow: 0 4px 16px rgba(4, 113, 67, 0.25);
}

.pay-btn:hover:not(:disabled) {
  background: #035a36 !important;
  transform: translateY(-2px);
  box-shadow: 0 6px 24px rgba(4, 113, 67, 0.35);
}

.nav-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

/* Sidebar Summary */
.checkout-sidebar {
  position: sticky;
  top: 2rem;
  height: fit-content;
}

.summary-card {
  background: white;
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 6px 30px rgba(0, 0, 0, 0.1);
  border-left: 5px solid #f4a213;
  margin-bottom: 1.5rem;
}

.summary-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 1.5rem;
}

.selected-tickets {
  margin-bottom: 1.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 2px solid #e9ecef;
}

.tickets-heading {
  font-size: 1rem;
  font-weight: 600;
  color: #495057;
  margin-bottom: 0.75rem;
}

.tickets-list-summary {
  list-style: none;
  padding: 0;
  margin: 0;
}

.tickets-list-summary li {
  padding: 0.5rem 0;
  color: #6c757d;
  font-size: 0.95rem;
}

.price-breakdown {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.price-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.price-row.subtotal,
.price-row.service-charge {
  font-size: 0.95rem;
  color: #6c757d;
}

.price-row.total {
  font-size: 1.25rem;
  font-weight: 700;
  color: #047143;
  padding-top: 0.75rem;
  border-top: 2px solid #e9ecef;
  margin-top: 0.5rem;
}

/* Promo Section */
.promo-section,
.mobile-promo {
  margin-top: 1.5rem;
}

.promo-input {
  width: 100%;
  padding: 0.875rem 1.125rem;
  font-size: 0.95rem;
  border: 2px solid #e9ecef;
  border-radius: 12px;
  margin-bottom: 0.75rem;
  transition: all 0.3s ease;
}

.promo-input:focus {
  outline: none;
  border-color: #f4a213;
  box-shadow: 0 0 0 4px rgba(244, 162, 19, 0.1);
}

.apply-btn {
  width: 100%;
  padding: 0.875rem;
  background: #f4a213;
  color: white;
  border: none;
  border-radius: 12px;
  font-weight: 700;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.apply-btn:hover {
  background: #d68910;
  transform: translateY(-1px);
  box-shadow: 0 4px 16px rgba(244, 162, 19, 0.3);
}

.discount-message {
  margin-top: 0.75rem;
  padding: 0.75rem;
  background: #d4edda;
  border: 1px solid #c3e6cb;
  border-radius: 8px;
  color: #155724;
  font-size: 0.9rem;
}

.mobile-promo {
  padding: 1.5rem;
  background: #f8f9fa;
  border-radius: 16px;
  margin-top: 2rem;
}

.fee-notice {
  display: block;
  margin-top: 1rem;
  color: #6c757d;
  font-size: 0.85rem;
}
</style>
