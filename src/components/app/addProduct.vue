<template>
  <div class=" ">
    <!-- Stepper -->
    <div class="stepper pt-2 mx-auto">
      <div
        v-for="(step, index) in steps"
        :key="index"
        class="step"
        :class="{
          active: currentStep === index,
          completed: index < currentStep,
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
    <div class="row justify-content-center">
      <div class="col-12 col-md-9 col-lg-6">
        <form
          @submit.prevent="submitProduct"
          enctype="multipart/form-data"
          class="shadow p-4 w-md-75 mx-auto w-100"
        >
          <!-- STEP 1: Basic Info -->
          <div class="" v-if="currentStep === 0">
            <div class="row">
              <div class="mb-3 col-md-7">
                <label for="title" class="form-label"
                  >What is your event name:</label
                >
                <input
                  v-model="product.title"
                  placeholder="Tech Summit, Afro summit"
                  type="text"
                  id="title"
                  :class="{ 'is-invalid': product.title && !isValidTitle() }"
                  class="form-control"
                />
                <div
                  v-if="product.title && !isValidTitle()"
                  class="invalid-feedback"
                >
                  Title must be at least two words.
                </div>
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
                  <select class="form-select" v-model="categoryID">
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
                <label for="Price" class="form-label mb-3">Price:</label>
                <input
                  v-model="product.price"
                  type="text"
                  placeholder="price"
                  id="price"
                  class="form-control"
                />
                <small>Leave blank for a free event</small>
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

              <!-- Time Zone -->
              <div class="row mb-3">
                <div class="col-md-6">
                  <form
                    @submit.prevent="handleGeocode"
                    class="card p-4 shadow-sm mb-4"
                  >
                    <div class="mb-3">
                      <label for="address" class="form-label"
                        >Enter Address:</label
                      >
                      <input
                        v-model="address"
                        type="text"
                        class="form-control"
                        id="address"
                        placeholder="e.g. 1600 Amphitheatre Parkway, CA"
                        required
                      />
                    </div>

                    <button type="submit" class="btn btn-primary">
                      Get Coordinates
                    </button>
                    <div v-if="coordinates" class="alert alert-success">
                      <strong>Latitude:</strong> {{ coordinates.lat }} <br />
                      <strong>Longitude:</strong> {{ coordinates.lng }}
                    </div>

                    <div v-if="coordinates" class="mt-4">
                      <iframe
                        :src="mapUrl"
                        width="100%"
                        height="300"
                        style="border: 0"
                        allowfullscreen=""
                        loading="lazy"
                        referrerpolicy="no-referrer-when-downgrade"
                      ></iframe>
                    </div>
                  </form>
                </div>

                <div class="col-md-6">
                  <label class="form-label">* Select time zone</label>
                  <select class="form-select" v-model="product.event.timezone">
                    <option value="">Select Time Zone</option>
                    <option value="UTC+01:00">
                      (UTC+01:00) West Central Africa
                    </option>
                    <option value="UTC+00:00">(UTC+00:00) GMT</option>
                    <option value="UTC-05:00">
                      (UTC-05:00) Eastern Time (US & Canada)
                    </option>
                    <!-- Add more as needed -->
                  </select>
                </div>
              </div>
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

                    <select class="form-select w-md-50" v-model="startAmPm">
                      <option>AM</option>
                      <option>PM</option>
                    </select>
                  </div>
                </div>

                <div class="col-md-6 mb-3">
                  <label class="form-label">End time</label>
                  <div class="d-flex justify-content-between">
                    <div class="mt-2">
                      <input
                        type="time"
                        class="form-control"
                        v-model="product.event.endTime"
                      />
                    </div>

                    <select class="form-select w-md-50" v-model="endAmPm">
                      <option>AM</option>
                      <option>PM</option>
                    </select>
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
                    Images with a 1:1 ratio (a square) work best on all event
                    themes
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
                      <p v-if="photos.length">
                        Selected: {{ photos.length }} image(s)
                      </p>
                    </label>

                    <!-- Preview -->
                    <div v-if="previewUrl" class="text-center mt-3">
                      <img
                        :src="previewUrl"
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
                <div class="col-md-6">
                  <div
                    class="d-flex justify-content-between align-items-center"
                  >
                    <div>
                      <h5><strong>Event Page Theme</strong></h5>
                      <p class="text-muted small mb-2">
                        Select the layout for your event page - it will only
                        take 2 minutes
                      </p>
                    </div>
                    <a href="#" class="text-decoration-none text-muted small">
                      <i class="bi bi-play-circle"></i> Preview theme
                    </a>
                  </div>

                  <div
                    class="border rounded bg-light p-3 d-flex align-items-center"
                    style="cursor: pointer"
                  >
                    <i
                      class="bi bi-layout-text-window-reverse fs-3 text-secondary me-3"
                    ></i>
                    <div>
                      <div class="small text-muted">Theme</div>
                      <div class="fw-bold">Choose theme</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- STEP 4: Location -->
          <div v-if="currentStep === 3">
            <div class="my-4 text-start">
              <h5><strong>Create your ticket types</strong></h5>
              <p class="text-danger small">
                *Please be sure to add taxes on top of ticket prices after this
                event has been created.
              </p>

              <div class="row fw-bold border-bottom pb-2 mb-2">
                <div class="col-md-4">Ticket name</div>
                <div class="col-md-3">Quantity</div>
                <div class="col-md-3">Price</div>
                <div class="col-md-2">Actions</div>
              </div>

              <!-- Ticket Rows -->
              <div
                v-for="(ticket, index) in tickets"
                :key="index"
                class="row align-items-center mb-2"
              >
                <div class="col-md-4">
                  <input
                    v-model="ticket.name"
                    type="text"
                    class="form-control"
                    placeholder="e.g. General Admission"
                  />
                </div>
                <div class="col-md-3">
                  <input
                    v-model.number="ticket.quantity"
                    type="number"
                    class="form-control"
                    placeholder=""
                  />
                </div>
                <div class="col-md-3">
                  <input
                    v-model.number="ticket.price"
                    type="number"
                    class="form-control"
                    placeholder="Blank for a free event"
                  />
                </div>
                <div class="col-md-2 d-flex pt-2 gap-3">
                  <button
                    class="btn btn-outline-danger"
                    title="Delete"
                    @click="removeTicket(index)"
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
            <button
              v-else
              type="submit"
              class="btn btn-primary btn-primary:hover"
            >
              Create Event
            </button>
          </div>
        </form>
      </div>
    </div>
    <spinner v-if="spinner" />
  </div>
</template>
<script>
import axios from "axios";
import { mapGetters } from "vuex";
import { QuillEditor } from "@vueup/vue-quill";
import "@vueup/vue-quill/dist/vue-quill.snow.css";
import spinner from "../spinner.vue";
export default {
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
      coordinates: null,
      API_KEY: "AIzaSyCkbHZXmqyIxjFpN8bMvDeURTmlpEhDHv4", // ⚠️ Replace with your actual key

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
        "https://event-ticket-qa70.onrender.com/api/categories"
      );
      this.categories = res.data.categories || res.data;
      console.log("Categories fetched:", this.categories);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  },
  methods: {
    isValidTitle() {
      return this.product.title.trim().split(/\s+/).length >= 2;
    },
    async handleGeocode() {
      try {
        const response = await axios.get(
          "https://maps.googleapis.com/maps/api/geocode/json",
          {
            params: {
              address: this.address,
              key: this.API_KEY,
            },
          }
        );
        const result = response.data.results[0];
        if (result) {
          const { lat, lng } = result.geometry.location;
          this.coordinates = { lat, lng };
        } else {
          alert("❌ No results found for this address.");
          this.coordinates = null;
        }
      } catch (error) {
        console.error("Geocoding error:", error);
        alert("❌ Failed to fetch location.");
      }
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
        quantity: null,
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

      formData.append(
        "eventDate",
        new Date(this.product.event.startDate).toISOString()
      );
      if (this.product.event.endDate) {
        formData.append(
          "endDate",
          new Date(this.product.event.endDate).toISOString()
        );
      }

      formData.append(
        "startTime",
        this.product.event.startTime + " " + this.startAmPm
      );
      formData.append(
        "endTime",
        this.product.event.endTime + " " + this.endAmPm
      );
      formData.append("timezone", this.product.event.timezone);
      formData.append("locationName", this.address); // Send address as name
      formData.append("lat", this.coordinates.lat);
      formData.append("lng", this.coordinates.lng);

      if (this.eventType === "recurring") {
        formData.append("eventFrequency", this.eventFrequency);
      }

      formData.append("tickets", JSON.stringify(this.tickets));
      console.log(this.tickets);
      this.photos.forEach((photo) => {
        formData.append("photos", photo);
      });
      for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }

      try {
        const response = await axios.post(
          "https://event-ticket-qa70.onrender.com/api/products",
          formData,
          {
            headers: {
              Authorization: `Bearer ${this.getToken}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );

        console.log("Product created:", response.data);
        alert("Event created successfully!");
      } catch (error) {
        console.error("Error creating event:", error);
        alert("Failed to create event");
      }
      this.spinner = false;
    },
  },
};
</script>

<style scoped>
.form-container {
  width: 95%;
  margin: auto;
  margin-top: 30px;
}

.stepper {
  position: relative;
  display: flex;
  justify-content: space-between;
  padding-bottom: 20px;
  margin-bottom: 30px;
}

.step {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  z-index: 1;
  color: #999;
}

.step .circle {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #ccc;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 5px;
  font-weight: bold;
}

.step.active .circle {
  background: black;
}

.step.completed .circle {
  background: #00bfa5;
}

.step.active {
  color: black;
}

.step.completed {
  color: #00bfa5;
}

.label {
  font-size: 14px;
  font-weight: 500;
}

.progress-line {
  position: absolute;
  bottom: 14px;
  left: 0;
  right: 0;
  height: 4px;
  background: #e0e0e0;
  z-index: 0;
}

.progress-fill {
  height: 4px;
  background: #00bfa5;
  transition: width 0.3s ease-in-out;
  width: 0%;
}
</style>
