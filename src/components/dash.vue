<template>
  <div class="">
    <!-- Sidebar -->
    <div :class="['sidebar', { 'sidebar-open': isOpen }]" class="d-none d-md-block">
      <!-- Header -->
      <div class="sidebar-header d-flex justify-content-between align-items-center p-3">
        <h5 class="mb-0 text-white">Menu</h5>
        <button class="btn btn-sm btn-light" @click="closeSidebar">×</button>
      </div>

      <!-- Sidebar Content -->
      <div class="sidebar-content p-3 text-white">
        <ul class="list-unstyled">
          <!-- Dashboard -->
          <li>
            <a @click="seen = !seen" class="text-white d-block">
              <i class="flaticon-381-networking"></i> Dashboard
            </a>
            <ul v-if="seen" class="list-unstyled ms-3">
              <li><a @click="onClickHomeTab" class="text-white">Dashboard</a></li>
              <li><a @click="onClickOrderTab" class="text-white">User Management</a></li>
            </ul>
          </li>

          <!-- Apps -->
          <li>
            <a @click="see = !see" class="text-white d-block">
              <i class="flaticon-381-television"></i> Apps
            </a>
            <ul v-if="see" class="list-unstyled ms-3">
              <li><a @click="onClickBankTab" class="text-white">Bank Info</a></li>
              <li><a @click="onClickEventTab" class="text-white">My Event</a></li>
              <li><a @click="onClickAddEventTab" class="text-white">Add Event</a></li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
    <div class="d-block d-md-none p-2">
      <div
        class="dropdown form-control p-2"
        @click="toggleDropdown"
        style="width: fit-content"
      >
        <a class="dropdown-toggle" :class="{ active: isDropdownOpen }">
          {{ mobileTab }}
        </a>
        <div class="dropdown-menu" :class="{ show: isDropdownOpen }">
          <a class="dropdown-item" @click="onClickHomeTab">Dashboard</a>
          <a class="dropdown-item" @click="onClickOrderTab">User Management</a>
          <a class="dropdown-item" @click="onClickBankTab">Bank Info</a>
          <a class="dropdown-item" @click="onClickEventTab">My Event</a>
          <a class="dropdown-item" @click="onClickAddEventTab">Add Event</a>
        </div>
      </div>
    </div>
    <!-- Page Content -->
    <div :class="['page-content', { 'page-shift': isOpen }]">
      <button
        class="btn btn-primary m-2 d-none d-md-block"
        v-if="!isOpen"
        @click="openSidebar"
      >
        ☰
      </button>

      <Dashboard v-if="isAccountHomeVisible"></Dashboard>
      <Orders v-if="isOrdersVisible"></Orders>
      <Bank v-if="isBankVisible"></Bank>
      <event v-if="isEventVisible"></event>
      <addEvent v-if="isAddEventVisible"></addEvent>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import Dashboard from "./dashboard/dashboard.vue";
import Orders from "./dashboard/orderlist.vue";
import Bank from "./app/bank.vue";
import event from "./app/events.vue";
import addEvent from "./app/addEvent.vue";

export default {
  components: {
    Bank,
    Dashboard,

    event,

    addEvent,

    Orders,
  },
  data() {
    return {
      isSectionVisible: false,
      mobileTab: "Dashboard",
      seen: true,
      see: true,
      se: true,
      sidenavWidth: 0,
      isDropdownOpen: false,
      isOpen: false,

      isAccountHomeVisible: true,
      isBankVisible: false,
      isOrdersVisible: false,

      isEventVisible: false,
      isAddEventVisible: false,
    };
  },
  watch: {
    "$route.query.activeTab"(to, from) {
      // Only triggers when activeTab changes
      this.$router
        .push({
          query: {
            activeTab: to,
          },
        })
        .catch((err) => {});
      this.initialize();
    },
  },
  computed: {
    ...mapGetters(["isAdmin"]),
    isTablet() {
      // Adjust this condition based on your desired tablet screen size
      return window.innerWidth >= 768 && window.innerWidth < 1024;
    },
  },
  methods: {
    Resize() {
      // Close the tab when the page is resized
      // You can modify this logic based on your specific requirements
      this.sidenavWidth = 0;
      this.isNavOpen = false; // Add this line to close the nav when resizing
    },
    toggleDropdown() {
      this.isDropdownOpen = !this.isDropdownOpen;
    },
    openSidebar() {
      this.isOpen = true;
    },
    closeSidebar() {
      this.isOpen = false;
    },
    toggleSection() {
      this.isSectionVisible = !this.isSectionVisible;
    },
    ...mapActions(["getUser", "getTokenFromStorage"]),

    hideAll() {
      this.isAccountHomeVisible = false;

      this.isBankVisible = false;
      this.isOrdersVisible = false;

      this.isEventVisible = false;
      this.isAddEventVisible = false;
    },
    onClickHomeTab() {
      this.hideAll();
      this.isAccountHomeVisible = true;
      this.mobileTab = "Dashboard";
      this.$router
        .push({
          query: {
            activeTab: "dashboard",
          },
        })
        .catch((err) => {});
    },

    onClickEventTab() {
      this.hideAll();
      this.isEventVisible = true;
      this.mobileTab = "event";
      this.$router
        .push({
          query: {
            activeTab: "event",
          },
        })
        .catch((err) => {});
    },
    onClickAddEventTab() {
      this.hideAll();
      this.isAddEventVisible = true;
      this.mobileTab = "add-event";
      this.$router
        .push({
          query: {
            activeTab: "add-event",
          },
        })
        .catch((err) => {});
    },

    onClickBankTab() {
      this.hideAll();
      this.isBankVisible = true;
      this.mobileTab = "bank";
      this.$router
        .push({
          query: {
            activeTab: "bank",
          },
        })
        .catch((err) => {});
    },
    onClickOrderTab() {
      this.hideAll();
      this.isOrdersVisible = true;
      this.mobileTab = "user-management";
      this.$router
        .push({
          query: {
            activeTab: "user-management",
          },
        })
        .catch((err) => {});
    },
    onClickTab() {
      if (this.mobileTab == "dashboard") {
        this.onClickHomeTab();
      } else if (this.mobileTab == "orders") {
        this.onClickOrderTab();
      } else if (this.mobileTab == "bank") {
        this.onClickBankTab();
      } else if (this.mobileTab === "event") {
        this.onClickEventTab();
      } else if (this.mobileTab === "Add event") {
        this.onClickAddEventTab();
      }
    },
    initialize() {
      if (this.$route.query) {
        if (this.$route.query.activeTab == "dashboard") {
          this.onClickHomeTab();
        } else if (this.$route.query.activeTab == "user-management") {
          this.onClickOrderTab();
        } else if (this.$route.query.activeTab == "bank") {
          this.onClickBankTab();
        } else if (this.$route.query.activeTab == "event") {
          this.onClickEventTab();
        } else if (this.$route.query.activeTab == "add-event") {
          this.onClickAddEventTab();
        } else {
          this.onClickHomeTab();
        }
      }
    },
  },
  mounted() {
    this.initialize();
    window.addEventListener("resize", this.Resize);
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.Resize);
  },
};
</script>

<style scoped>
/* Sidebar base styles */
.sidebar {
  position: fixed;
  top: 0;
  left: -260px;
  width: 260px;
  height: 100%;
  background-color: #198754; /* Bootstrap success green */
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
  overflow-y: auto;
  z-index: 1050;
  transition: left 0.3s ease;
}
/* Default content */
.page-content {
  transition: margin-left 0.3s ease; /* smooth push */
  margin-left: 0; /* start aligned */
}

/* When sidebar is open */
.page-shift {
  margin-left: 250px; /* same width as your sidebar */
}

/* When sidebar is open */
.sidebar.sidebar-open {
  left: 0;
}

/* Overlay behind sidebar */
.sidebar-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.3);
  z-index: 1049;
}

/* Sidebar content styling */
.sidebar-content a {
  display: block;
  padding: 10px 0;
  color: white;
  text-decoration: none;
}
.sidebar-content a:hover {
  text-decoration: underline;
}

.sidebar-header {
  background-color: #157347;
}
</style>
