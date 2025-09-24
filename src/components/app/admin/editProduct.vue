<template>
  <div class="form-container">
    <!-- Stepper -->
    <div class="stepper pt-2 mx-auto">
      <div
        v-for="(step, index) in steps"
        :key="index"
        class="step"
        :class="{
          'step-active': currentStep === index,
          'step-completed': index < currentStep,
        }"
      >
        <div class="circle">
          <span v-if="index < currentStep">✔</span>
          <span v-else>{{ index + 1 }}</span>
        </div>
        <div class="label">{{ step }}</div>
      </div>
      <div class="progress-line">
        <div
          class="progress-fill"
          :style="{ width: (currentStep / (steps.length - 1)) * 100 + '%' }"
        ></div>
      </div>
    </div>

    <!-- Form -->
    <div class="row text-start">
      <div class="col-12">
        <form
          @submit.prevent="submitProduct"
          enctype="multipart/form-data"
          class="shadow p-4"
        >
          <!-- STEP 1: Basic Info -->
          <div class="" v-if="currentStep === 0">
            <div class="row">
              <div class="mb-3 col-md-7">
                <label for="title" class="form-label">What is your event name:</label>
                <input
                  v-model="product.title"
                  placeholder="Tech Summit, Afro summit"
                  type="text"
                  id="title"
                  class="form-control"
                />
              </div>
              <div class="mb-3 col-md-5">
                <div>
                  <div>
                    <label for="title" class="form-label">Tag:</label>
                    <input
                      v-model="product.tag"
                      type="text"
                      placeholder="Tags (comma-separated)"
                      id="title"
                      class="form-control"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div class="row mb-3">
              <div class="col-md-7">
                <label class="form-label">Event Category</label>
                <div>
                  <select
                    class="form-select"
                    v-if="categories.length > 0"
                    v-model="categoryID"
                  >
                    <option value="" disabled>Select a category</option>
                    <option
                      v-for="category in categories"
                      :key="category._id"
                      :value="category._id"
                    >
                      {{ category.type }}
                    </option>
                    <!-- Add more as needed -->
                  </select>
                </div>
              </div>
              <div class="col-md-5">
                <div class="">
                  <label for="customUrl" class="form-label">Use custom URL</label>
                  <div class="input-group pt-2">
                    <span class="input-group-text">234tickets.live/event/</span>
                    <input
                      type="text"
                      v-model="product.customizeUrl"
                      class="form-control pt-md-2"
                      id="customUrl"
                      placeholder="Enter your custom link"
                      readonly
                    />
                  </div>
                </div>
              </div>
            </div>
            <div class="mb-3">
              <label class="form-label">What's your event about:</label>
              <div>
                <textarea class="w-100 h-50" v-model="product.description" />
              </div>
            </div>
          </div>

          <!-- STEP 2: Description -->
          <div v-if="currentStep === 1">
            <div class="mt-4 text-start">
              <h4><strong>When is your event?</strong></h4>
              <p class="text-muted">Select all the dates of your event</p>

              <!-- Toggle Buttons -->
              <div class="btn-group mb-3" role="group">
                <button
                  type="button"
                  class="btn"
                  :class="
                    eventType === 'single'
                      ? 'btn-primary active'
                      : 'btn-outline-secondary'
                  "
                  @click="eventType = 'single'"
                >
                  Single Event
                </button>
                <button
                  type="button"
                  class="btn"
                  :class="
                    eventType === 'recurring'
                      ? 'btn-primary active'
                      : 'btn-outline-secondary'
                  "
                  @click="eventType = 'recurring'"
                >
                  Recurring Event
                </button>
              </div>

              <!-- Time Zone -->
              <div class="row mb-3">
                <div class="">
                  <div class="mb-3">
                    <label for="address" class="form-label">Enter Address:</label>
                    <input
                      v-model="address"
                      type="text"
                      class="form-control"
                      id="address"
                      placeholder="e.g. 1600 Amphitheatre Parkway, CA"
                      required
                    />
                  </div>
                </div>
              </div>
              <div class="row">
                <label class="form-label">* Select time zone</label>
                <select class="form-select" v-model="product.event.timezone">
                  <option value="">Select Time Zone</option>
                  <option value="UTC+01:00">(UTC+01:00) West Central Africa</option>
                  <option value="UTC+00:00">(UTC+00:00) GMT</option>
                  <option value="UTC-05:00">
                    (UTC-05:00) Eastern Time (US & Canada)
                  </option>
                  <!-- Add more as needed -->
                </select>
              </div>

              <!-- Start/End Date and Time -->
              <div class="row">
                <div class="col-md-6 mb-3">
                  <label class="form-label">* Start date</label>
                  <input
                    type="date"
                    class="form-control"
                    v-model="product.event.startDate"
                  />
                </div>
                <div class="col-md-6 mb-3" v-if="eventType === 'recurring'">
                  <label class="form-label">* End date</label>
                  <input
                    type="date"
                    class="form-control"
                    v-model="product.event.endDate"
                  />
                </div>
              </div>

              <div class="row">
                <div class="col-md-6 mb-3">
                  <label class="form-label">Start time</label>
                  <div class="d-flex justify-content-between">
                    <div class="mt-2">
                      <input
                        type="time"
                        class="form-control"
                        v-model="product.event.startTime"
                      />
                    </div>
                  </div>
                </div>

                <!-- Recurring Options -->
                <div class="col-md-4 mb-3" v-if="eventType === 'recurring'">
                  <label class="form-label">* Event frequency</label>
                  <select class="form-select" v-model="eventFrequency">
                    <option>Every day</option>
                    <option>Weekdays</option>
                    <option>Weekends</option>
                    <option>Every week</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <!-- STEP 3: Media Upload -->
          <div v-if="currentStep === 2">
            <div class="container py-5 text-start">
              <div class="row">
                <!-- Left Column: Event Image -->
                <div class="col-md-6">
                  <h5><strong>Event Image</strong></h5>
                  <p class="text-muted">Upload a JPEG or PNG file</p>

                  <div
                    class="alert alert-light border text-muted py-2 small d-flex align-items-start"
                  >
                    <i class="bi bi-info-circle-fill me-2 text-danger"></i>
                    Images with a 1:1 ratio (a square) work best on all event themes
                  </div>

                  <div>
                    <!-- Upload box -->
                    <label
                      for="imageUpload"
                      class="border rounded bg-light d-flex flex-column justify-content-center align-items-center text-center py-5 mb-2"
                      style="cursor: pointer"
                    >
                      <i class="bi bi-image fs-1 mb-2"></i>
                      <span>
                        Drag an image here or
                        <span class="text-danger fw-bold">click to upload</span>
                      </span>
                      <input
                        type="file"
                        multiple
                        @change="handleFiles"
                        accept="image/*"
                        id="imageUpload"
                        class="d-none"
                      />
                      <p v-if="photos.length">Selected: {{ photos.length }} image(s)</p>
                    </label>

                    <!-- Preview -->
                    <div
                      v-if="previewUrl || (product.photos && product.photos.length)"
                      class="text-center mt-3"
                    >
                      <img
                        :src="previewUrl || product.photos[0]"
                        alt="Preview"
                        class="img-fluid rounded shadow"
                        style="max-height: 250px"
                      />
                    </div>
                  </div>
                  <p class="text-muted small">
                    Upload an image with a size less than 2mb
                  </p>
                </div>

                <!-- Right Column: Event Theme -->
              </div>
            </div>
          </div>

          <!-- STEP 4: Location -->
          <div v-if="currentStep === 3">
            <div class="my-4 text-start">
              <h5><strong>Create your ticket types</strong></h5>

              <!-- Ticket Rows -->
              <div
                v-for="(ticket, index) in tickets"
                :key="index"
                class="row g-3 align-items-end mb-2"
              >
                <div class="col-md-3">
                  <label class="form-label">Ticket name</label>
                  <input
                    v-model="ticket.name"
                    type="text"
                    class="form-control"
                    placeholder="e.g. General Admission"
                    required
                  />
                </div>

                <div class="col-md-2">
                  <label class="form-label">Quantity</label>
                  <input
                    v-model.number="ticket.quantity"
                    type="number"
                    class="form-control"
                    :disabled="ticket.type === 'unlimited'"
                    :required="ticket.type === 'limited'"
                    min="1"
                    placeholder="e.g. 100"
                  />
                </div>

                <div class="col-md-2">
                  <label class="form-label">Price</label>
                  <input
                    v-model.number="ticket.price"
                    type="number"
                    class="form-control"
                    placeholder="Blank for free event"
                  />
                </div>

                <div class="col-md-2">
                  <label class="form-label">Type</label>
                  <select v-model="ticket.type" class="form-control" required>
                    <option disabled value="">Select type</option>
                    <option value="limited">Limited</option>
                    <option value="unlimited">Unlimited</option>
                  </select>
                </div>

                <div class="col-md-2">
                  <label class="form-label">Purchase Limit</label>
                  <input
                    v-model.number="ticket.purchaseLimit"
                    type="number"
                    class="form-control"
                    min="1"
                    placeholder="tickets per order"
                    required
                  />
                </div>

                <div class="col-md-1 d-flex align-items-end">
                  <button
                    class="btn btn-outline-danger"
                    title="Delete"
                    @click="removeTicket(index)"
                    type="button"
                  >
                    <i class="bi bi-trash"></i>
                  </button>
                </div>
              </div>

              <!-- Timeslot Capacity -->

              <!-- Add Ticket Buttons -->
              <div class="d-flex gap-3">
                <button
                  class="btn btn-primary btn-primary:hover"
                  type="button"
                  @click="addTicket('Paid')"
                >
                  + ticket
                </button>
              </div>
            </div>
          </div>

          <!-- Buttons -->
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
              v-if="currentStep < steps.length - 1"
              type="button"
              class="btn btn-primary btn-primary:hover"
              @click="nextStep"
            >
              Next
            </button>
            <button v-else type="submit" class="btn btn-primary btn-primary:hover">
              Update Event
            </button>
          </div>
          <spinner v-if="spinner" />
        </form>
      </div>
    </div>
  </div>
</template>
<script>
import axios from "axios";
import { mapGetters } from "vuex";
import { QuillEditor } from "@vueup/vue-quill";
import spinner from "../../spinner.vue";
import "@vueup/vue-quill/dist/vue-quill.snow.css";

export default {
  props: {
    productId: {
      type: String,
      required: true,
    },
  },

  components: {
    QuillEditor,
    spinner,
  },
  data() {
    return {
      currentStep: 0,
      steps: ["Basic Info", "Event Details", "Media Upload", "Tickets"],
      categories: [],
      spinner: false,
      categoryID: "",
      product: {
        title: "",
        description: "",
        tag: "",
        price: "",
        event: {
          startDate: "",
          endDate: "",
          startTime: "",
          endTime: "",
          timezone: "UTC",
          location: "",
        },
      },
      address: "",

      startAmPm: "AM",
      endAmPm: "PM",
      eventType: "single", // or "recurring"
      eventFrequency: "",
      photos: [],
      previewUrl: null,
      tickets: [{ name: "", price: null, quantity: null }],
    };
  },
  computed: {
    ...mapGetters(["getToken"]),
    mapUrl() {
      if (!this.coordinates) return "";
      const { lat, lng } = this.coordinates;
      return `https://www.google.com/maps/embed/v1/view?key=${this.API_KEY}&center=${lat},${lng}&zoom=15`;
    },
  },
  async created() {
    try {
      const res = await axios.get(
        "https://event-ticket-backend-yx81.onrender.com  /api/categories"
      );
      this.categories = res.data.categories || res.data;
      console.log("Categories fetched:", this.categories);
      if (this.productId) {
        await this.fetchProduct(); // fetch product if editing
      }
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  },
  watch: {
    productId(newVal) {
      if (newVal) {
        this.fetchProduct();
      }
    },
  },

  methods: {
    async fetchProduct() {
      try {
        const response = await axios.get(
          `https://event-ticket-backend-yx81.onrender.com  /api/product/${this.productId}`
        );
        console.log("Product data:", response.data);

        const data = response.data.product;

        // Basic fields
        this.product.title = data.title;
        this.product.description = data.description;
        this.product.tag = data.tag?.join(", ") || "";
        //this.product.price = data.price;

        this.categoryID = data.category;

        // Photos (for preview)
        this.product.photos = data.photos || [];
        this.product.customizeUrl = data.customizeUrl || "";

        // Event mapping
        if (data.event) {
          const start = data.event.start;
          const end = data.event.end;

          this.product.event.startDate = start?.split("T")[0] || "";
          this.product.event.startTime = (data.event.startTime || "").trim();

          this.product.event.endDate = end?.split("T")[0] || "";
          this.product.event.endTime = (data.event.endTime || "").trim();

          this.product.event.timezone = data.event.timezone || "";
          this.address = data.event.location?.name || "";
          this.tickets = data.event.tickets || [];
        }

        console.log("Product loaded:", data);
      } catch (error) {
        if (error.response && error.response.status === 401) {
          localStorage.removeItem("token");
          router.push("/login");
        } else {
          throw error;
        }
      }
    },

    getAmPm(timeString) {
      if (!timeString) return "AM";
      const hour = parseInt(timeString.split(":")[0], 10);
      return hour >= 12 ? "PM" : "AM";
    },

    nextStep() {
      if (this.currentStep < this.steps.length - 1) {
        this.currentStep++;
      }
    },
    prevStep() {
      if (this.currentStep > 0) {
        this.currentStep--;
      }
    },
    handleFiles(event) {
      const files = Array.from(event.target.files);
      this.photos = files;
      if (files.length > 0) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.previewUrl = e.target.result;
        };
        reader.readAsDataURL(files[0]);
      }
    },
    addTicket(type) {
      const defaultPrice =
        type === "Paid" ? "Cost" : type === "Donation" ? "Any" : "Free";
      this.tickets.push({
        name: "",
        quantity: "Unlimited",
        price: null,
      });
    },
    removeTicket(index) {
      this.tickets.splice(index, 1);
    },
    duplicateTicket(index) {
      const ticket = this.tickets[index];
      this.tickets.splice(index + 1, 0, { ...ticket });
    },
    async submitProduct() {
      this.spinner = true;
      const formData = new FormData();

      formData.append("categoryID", this.categoryID);
      formData.append("title", this.product.title);
      formData.append("description", this.product.description);
      formData.append("tag", this.product.tag);
      formData.append("price", this.product.price);

      formData.append("eventDate", new Date(this.product.event.startDate).toISOString());
      if (this.product.event.endDate) {
        formData.append("endDate", new Date(this.product.event.endDate).toISOString());
      }
      formData.append("startTime", this.product.event.startTime);
      formData.append("endTime", this.product.event.endTime);
      formData.append("timezone", this.product.event.timezone);
      formData.append("locationName", this.address);

      if (this.eventType === "recurring") {
        formData.append("eventFrequency", this.eventFrequency);
      }

      formData.append("tickets", JSON.stringify(this.tickets));

      this.photos.forEach((photo) => {
        formData.append("photos", photo);
      });

      try {
        const response = await axios.put(
          `https://event-ticket-backend-yx81.onrender.com  /api/product/${this.productId}`, // 👈 PUT endpoint with ID
          formData,
          {
            headers: {
              Authorization: `Bearer ${this.getToken}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );

        console.log("Product updated:", response.data);

        alert("Event updated successfully!");
        this.$emit("close"); // To close the modal
        this.$emit("refresh");
      } catch (error) {
        if (error.response && error.response.status === 401) {
          localStorage.removeItem("token");
          router.push("/login");
        } else {
          throw error; // Other errors get thrown normally
        }
      }
      this.spinner = false;
    },
  },
};
</script>
<style scoped>
/* Container for the form or content */
.form-container {
  width: 95%;
  margin: auto;
  margin-top: 30px;
}

/* Stepper layout */
.stepper {
  position: relative;
  display: flex;
  justify-content: space-between;
  padding-bottom: 20px;
  margin-bottom: 30px;
}

/* Each step container */
.step {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  z-index: 1;
  color: #999;
  text-align: center;
}

/* Step circle */
.step .circle {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background-color: #ccc;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 5px;
  font-weight: bold;
  font-size: 14px;
  transition: background-color 0.3s, border-color 0.3s;
}

/* Step label below the circle */
.step .label {
  font-size: 13px;
  font-weight: 500;
  margin-top: 2px;
}

/* ACTIVE step */
.step.step-active .circle {
  background-color: #f4a213;
  border: 2px solid #f4a213;
  color: white;
}

/* COMPLETED step (with checkmark) */
.step.step-completed .circle {
  background-color: #f4a213;
  border: 2px solid #f4a213;
  color: white;
}

.step.step-active .label,
.step.step-completed .label {
  color: #f4a213;
}

/* Progress line background */
.progress-line {
  position: absolute;
  bottom: 14px;
  left: 0;
  right: 0;
  height: 4px;
  background-color: #e0e0e0;
  z-index: 0;
}

/* Progress fill based on currentStep */
.progress-fill {
  height: 4px;
  background-color: #f4a213;
  transition: width 0.3s ease-in-out;
  width: 0%;
}

/* Optional: Responsive tweaks */
@media (max-width: 576px) {
  .step .label {
    font-size: 11px;
  }

  .step .circle {
    width: 24px;
    height: 24px;
    font-size: 12px;
  }
}
</style>
