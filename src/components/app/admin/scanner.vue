<template>
  <div class="scanner-container">
    <div class="scanner-header">
      <h2 class="scanner-title">🎯 Ticket Scanner</h2>
      <p class="scanner-subtitle">Scan QR codes to validate event tickets</p>
    </div>

    <!-- Scanner Card -->
    <div class="scanner-card">
      <!-- Button to start scanning -->
      <button 
        v-if="!scanning" 
        @click="startScanning" 
        class="scan-button"
      >
        <span class="scan-icon">📷</span>
        <span>Start Scanning</span>
      </button>

      <!-- QR Scanner -->
      <div v-if="scanning" class="scanner-window">
        <qrcode-stream
          :constraints="{ facingMode: 'environment' }"
          @detect="onDetect"
          @error="onError"
        />
        <div class="scanner-overlay">
          <div class="scanner-frame"></div>
        </div>
      </div>

      <!-- Error Message -->
      <div v-if="error" class="alert alert-error">
        <span class="alert-icon">⚠️</span>
        <span>{{ error }}</span>
      </div>

      <!-- Scan Result -->
      <div v-if="result && !ticket && !notFound" class="scan-result">
        <div class="loading-spinner"></div>
        <p>Validating ticket: <strong>{{ result }}</strong></p>
      </div>
    </div>

    <!-- Ticket Details Card -->
    <transition name="slide-up">
      <div v-if="ticket" class="ticket-details-card">
        <div class="ticket-header">
          <h3>✅ Valid Ticket</h3>
        </div>
        
        <div class="ticket-body">
          <div class="detail-row">
            <span class="detail-label">Event</span>
            <span class="detail-value">{{ ticket.title }}</span>
          </div>
          
          <div class="detail-row">
            <span class="detail-label">Reference</span>
            <span class="detail-value reference-code">{{ ticket.reference }}</span>
          </div>
          
          <div class="detail-row">
            <span class="detail-label">Email</span>
            <span class="detail-value">{{ ticket.contact?.email || 'N/A' }}</span>
          </div>
          
          <div class="detail-row">
            <span class="detail-label">Phone</span>
            <span class="detail-value">{{ ticket.contact?.phone || 'N/A' }}</span>
          </div>

          <div class="tickets-section">
            <h4 class="tickets-title">Tickets Purchased</h4>
            <div class="ticket-items">
              <div 
                v-for="t in ticket.tickets" 
                :key="t._id"
                class="ticket-item"
              >
                <span class="ticket-name">{{ t.name }}</span>
                <span class="ticket-quantity">×{{ t.quantity }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>

    <!-- Ticket Not Found -->
    <transition name="slide-up">
      <div v-if="notFound" class="alert alert-danger">
        <span class="alert-icon">❌</span>
        <span>Ticket not found. Please verify the QR code.</span>
      </div>
    </transition>
  </div>
</template>

<script>
import { QrcodeStream } from "vue-qrcode-reader";
import axios from "axios";

export default {
  name: "QRScanner",
  components: { QrcodeStream },
  data() {
    return {
      scanning: false, // Controls camera visibility
      result: "",
      ticket: null,
      error: "",
      notFound: false,
    };
  },
  methods: {
    startScanning() {
      this.scanning = true;
    },
    async onDetect(detectedCodes) {
      const reference = detectedCodes[0]?.rawValue;
      this.result = reference;
      this.ticket = null;
      this.notFound = false;
      this.error = ""; // Reset error message

      try {
        const res = await axios.get(`https://event-ticket-backend-yx81.onrender.com/api/order/${reference}`);
        this.ticket = res.data.order;
      } catch (err) {
        if (err.response) {
          if (err.response.status === 404) {
            this.notFound = true;
          } else if (err.response.status === 409) {
            this.error = "❌ This ticket has already been scanned.";
            window.alert(this.error); // ✅ Show popup alert
          } else {
            this.error = "⚠️ Server error. Please try again.";
            window.alert(this.error);
          }
        } else {
          this.error = "⚠️ Network error. Please check your connection.";
          window.alert(this.error);
        }

        console.error(err);
      }
    },
    onError(err) {
      console.error(err);
      this.error = "Camera access or scanning failed.";
    },
  },
};
</script>

<style scoped>
.scanner-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 1rem;
  min-height: 100vh;
}

.scanner-header {
  text-align: center;
  margin-bottom: 2rem;
  padding-top: 1rem;
}

.scanner-title {
  font-size: 2rem;
  font-weight: 700;
  color: #228B22;
  margin: 0 0 0.5rem;
}

.scanner-subtitle {
  color: #666;
  font-size: 1rem;
  margin: 0;
}

.scanner-card {
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  padding: 2rem;
  margin-bottom: 1.5rem;
}

.scan-button {
  width: 100%;
  padding: 1.25rem 2rem;
  background: linear-gradient(135deg, #228B22 0%, #047143 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1.125rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(34, 139, 34, 0.3);
}

.scan-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(34, 139, 34, 0.4);
}

.scan-button:active {
  transform: translateY(0);
}

.scan-icon {
  font-size: 1.5rem;
}

.scanner-window {
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  background: #000;
  aspect-ratio: 1;
  max-height: 400px;
}

.scanner-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
}

.scanner-frame {
  width: 250px;
  height: 250px;
  border: 3px solid #228B22;
  border-radius: 12px;
  box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.5);
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.8;
    transform: scale(1.02);
  }
}

.alert {
  padding: 1rem 1.25rem;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-top: 1rem;
  font-size: 0.95rem;
  font-weight: 500;
}

.alert-error {
  background: #fff3cd;
  border-left: 4px solid #DC143C;
  color: #856404;
}

.alert-danger {
  background: #f8d7da;
  border-left: 4px solid #DC143C;
  color: #721c24;
}

.alert-icon {
  font-size: 1.25rem;
}

.scan-result {
  text-align: center;
  padding: 1.5rem;
  color: #666;
}

.loading-spinner {
  margin: 0 auto 1rem;
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #228B22;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.ticket-details-card {
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  margin-bottom: 1.5rem;
}

.ticket-header {
  background: linear-gradient(135deg, #228B22 0%, #047143 100%);
  color: white;
  padding: 1.25rem 1.5rem;
}

.ticket-header h3 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 700;
}

.ticket-body {
  padding: 1.5rem;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.875rem 0;
  border-bottom: 1px solid #f0f0f0;
}

.detail-row:last-child {
  border-bottom: none;
}

.detail-label {
  font-weight: 600;
  color: #666;
  font-size: 0.9rem;
}

.detail-value {
  font-weight: 500;
  color: #333;
  text-align: right;
  word-break: break-word;
  max-width: 60%;
}

.reference-code {
  font-family: 'Courier New', monospace;
  color: #228B22;
  font-weight: 700;
  font-size: 0.9rem;
}

.tickets-section {
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 2px solid #f0f0f0;
}

.tickets-title {
  font-size: 1rem;
  font-weight: 700;
  color: #333;
  margin: 0 0 1rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.ticket-items {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.ticket-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.875rem 1rem;
  background: #f9f9f9;
  border-radius: 8px;
  border-left: 3px solid #228B22;
}

.ticket-name {
  font-weight: 600;
  color: #333;
  font-size: 0.95rem;
}

.ticket-quantity {
  font-weight: 700;
  color: #228B22;
  font-size: 1.1rem;
}

.slide-up-enter-active, .slide-up-leave-active {
  transition: all 0.3s ease-out;
}

.slide-up-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.slide-up-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

@media (max-width: 576px) {
  .scanner-container {
    padding: 0.75rem;
  }

  .scanner-title {
    font-size: 1.5rem;
  }

  .scanner-subtitle {
    font-size: 0.9rem;
  }

  .scanner-card {
    padding: 1.25rem;
  }

  .scan-button {
    padding: 1rem 1.5rem;
    font-size: 1rem;
  }

  .scanner-frame {
    width: 200px;
    height: 200px;
  }

  .detail-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.25rem;
  }

  .detail-value {
    max-width: 100%;
    text-align: left;
  }

  .ticket-item {
    padding: 0.75rem;
  }
}
</style>
