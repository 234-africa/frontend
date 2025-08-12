<template>
  <div class="container">
    <h2>🎯 Scan Ticket QR Code</h2>

  
    <qrcode-stream
      :constraints="{ facingMode: 'environment' }"
      @detect="onDetect"
      @error="onError"
    />

    <p v-if="error" class="error">{{ error }}</p>
      <p class="decode-result">
      Result: <b>{{ result }}</b>
    </p>

<div v-if="ticket" class="text-start" style="border: 1px solid #ddd; border-radius: 8px; padding: 16px; background: #f9f9f9; max-width: 600px;">
  <h4 style="margin-bottom: 16px;">🎟️ Ticket Details</h4>

  <div style="display: flex; border-top: 1px solid #ddd; padding: 8px 0;" v-for="(value, label) in {
      'Event': ticket.title,
      'Reference': ticket.reference,
      'Email': ticket.contact?.email || 'N/A',
      'Phone': ticket.contact?.phone || 'N/A'
    }" :key="label">
    <div style="width: 120px; font-weight: bold;">{{ label }}:</div>
    <div style="border-left: 1px solid #ccc; padding-left: 12px;">{{ value }}</div>
  </div>

  <!-- Tickets -->
  <div style="display: flex; border-top: 1px solid #ddd; padding: 8px 0;">
    <div style="width: 120px; font-weight: bold;">Tickets:</div>
    <div style="border-left: 1px solid #ccc; padding-left: 12px;">
      <ul style="margin: 0; padding-left: 20px;">
        <li v-for="t in ticket.tickets" :key="t._id">
          {{ t.name }} x {{ t.quantity }}
        </li>
      </ul>
    </div>
  </div>
</div>


    <div v-if="notFound">
      <p class="text-danger">❌ Ticket not found.</p>
    </div>
  </div>
</template>

<script>
import { QrcodeStream } from 'vue-qrcode-reader'
import axios from 'axios'

export default {
  name: 'QRScanner',
  components: {
    QrcodeStream
  },
  data() {
    return {
      result: '',
      ticket: null,
      error: '',
      notFound: false
    }
  },
  methods: {
    async onDetect(detectedCodes) {
      const reference = detectedCodes[0]?.rawValue
      this.result = reference
      this.ticket = null
      this.notFound = false

      try {
        const res = await axios.get(`https://event-ticket-qa70.onrender.com/api/order/${reference}`)
        this.ticket = res.data.order
      } catch (err) {
        if (err.response && err.response.status === 404) {
          this.notFound = true
        } else {
          this.error = 'Server error. Please try again.'
        }
        console.error(err)
      }
    },
    onError(err) {
      console.error(err)
      this.error = 'Camera access or scanning failed.'
    }
  }
}
</script>

<style scoped>
.container {
  max-width: 600px;
  margin: 2rem auto;
  text-align: center;
}
.decode-result {
  margin-top: 1rem;
  font-size: 1.2rem;
}
.error {
  color: red;
}
</style>
