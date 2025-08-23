<template>
  <div>
    <!-- Sidebar -->
    <div :class="['sidebar d-none d-md-block', { 'sidebar-open': isOpen }]">
      <!-- Sidebar Header -->
      <div
        class="sidebar-header d-flex justify-content-between align-items-center p-3 border-bottom"
      >
        <h5 class="mb-0 text-white">Menu</h5>
        <button class="btn btn-sm btn-light" @click="closeSidebar">×</button>
      </div>

      <!-- Sidebar Content -->
      <div class="sidebar-content p-3">
        <ul class="list-unstyled">
          <!-- All -->
          <li>
            <a class="d-flex align-items-center cursor-pointer" @click="seen = !seen">
              <i v-if="!isTablet" class="flaticon-381-networking me-2"></i>
              <span>All</span>
            </a>
            <ul v-if="seen" class="list-unstyled ms-3">
              <li><a @click="onClickHomeTab">Events</a></li>
              <li><a @click="onClickCategoryTab">Category</a></li>
              <li><a @click="onClickUserTab">Users</a></li>
              <li><a @click="onClickScannerTab">Scanner</a></li>
            </ul>
          </li>

          <!-- Apps -->
          <li>
            <a class="d-flex align-items-center cursor-pointer" @click="see = !see">
              <i class="flaticon-381-television me-2"></i>
              <span>Apps</span>
            </a>
            <ul v-if="see" class="list-unstyled ms-3">
              <li><a @click="onClickBankTab">Bank Info</a></li>
              <li><a @click="onClickOrderTab">Orders</a></li>
              <li><a @click="onClickAddEventTab">Add Event</a></li>
            </ul>
          </li>
        </ul>
      </div>
    </div>

    <!-- Mobile Dropdown -->
    <div class="d-block d-md-none px-2 pb-2">
      <div class="dropdown form-control p-2 w-auto" @click="toggleDropdown">
        <a class="dropdown-toggle" :class="{ active: isDropdownOpen }">
          {{ mobileTab }}
        </a>
        <div class="dropdown-menu" :class="{ show: isDropdownOpen }">
          <a class="dropdown-item" @click="onClickHomeTab">Events</a>
          <a class="dropdown-item" @click="onClickCategoryTab">Categories</a>
          <a class="dropdown-item" @click="onClickUserTab">Users</a>
          <a class="dropdown-item" @click="onClickScannerTab">Scanner</a>
          <a class="dropdown-item" @click="onClickBankTab">Bank Info</a>
          <a class="dropdown-item" @click="onClickOrderTab">Orders</a>
          <a class="dropdown-item" @click="onClickAddEventTab">Add Event</a>
        </div>
      </div>
    </div>

    <!-- Page Content -->
    <div class="page-content" :class="{ 'page-shift': isOpen }">
      <!-- Menu Button (only shows when sidebar is closed) -->
      <button
        class="btn btn-primary m-2 d-none d-md-block"
        v-if="!isOpen"
        @click="openSidebar"
      >
        ☰
      </button>

      <!-- Components -->
      <events v-if="isAccountHomeVisible"></events>
      <category v-if="isCategoryVisible"></category>
      <users v-if="isUsersVisible"></users>
      <Scanner v-if="isScannerVisible"></Scanner>
      <Orders v-if="isOrdersVisible"></Orders>
      <banks v-if="isBanksVisible"></banks>
      <addEvent v-if="isAddEventVisible"></addEvent>
    </div>
  </div>
</template>

<style scoped>
/* Sidebar */
.sidebar {
  position: fixed;
  top: 0;
  left: -260px; /* hidden by default */
  width: 260px;
  height: 100%;
  background-color: #198754;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
  transition: left 0.3s ease;
  z-index: 1050;
  color: white;
}
.sidebar.sidebar-open {
  left: 0; /* slide in */
}

/* Page Content */
.page-content {
  transition: margin-left 0.3s ease;
  margin-left: 0;
}
.page-shift {
  margin-left: 260px; /* same width as sidebar */
}

/* Sidebar Header */
.sidebar-header {
  background-color: #157347;
}

/* Sidebar links */
.sidebar-content a {
  display: block;
  padding: 10px 0;
  color: white;
  text-decoration: none;
}
.sidebar-content a:hover {
  text-decoration: underline;
}
</style>
<script>
import { mapActions, mapGetters } from "vuex";

import Events from "./app/admin/events.vue";
import Orders from "./app/admin/orders.vue";
import Scanner from "./app/admin/scanner.vue";
import Banks from "./app/admin/bank.vue";
import Users from "./app/admin/users.vue";
import addEvent from "./app/admin/addEvent.vue";

import Category from "./app/admin/category.vue";

export default {
  components: {
    Events,
    Orders,
    addEvent,
    Banks,
    Category,
    Scanner,
    Users,
  },
  data() {
    return {
      isSectionVisible: false,
      mobileTab: "events",
      seen: true,
      see: true,
      isOpen: false,
      se: true,
      sidenavWidth: 250,
      isDropdownOpen: false,
      isOpen: false,

      isAccountHomeVisible: true,
      isAccountHomVisible: true,
      isUsersVisible: true,
      isScannerVisible: true,
      isCalenderVisible: false,
      isOrdersVisible: false,

      isOrderVisible: false,
      isAddEventVisible: false,

      isEmailComposeVisible: false,
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
    openSidebar() {
      this.isOpen = true;
    },
    closeSidebar() {
      this.isOpen = false;
    },
    Resize() {
      // Close the tab when the page is resized
      // You can modify this logic based on your specific requirements
      this.sidenavWidth = 0;
      this.isNavOpen = false; // Add this line to close the nav when resizing
    },
    toggleDropdown() {
      this.isDropdownOpen = !this.isDropdownOpen;
    },
    toggleNav() {
      this.isNavOpen = !this.isNavOpen;
      this.sidenavWidth = this.isNavOpen ? 250 : 0;
    },
    closeNav() {
      this.isNavOpen = false;
      this.sidenavWidth = 0;
    },
    toggleSection() {
      this.isSectionVisible = !this.isSectionVisible;
    },
    ...mapActions(["getUser", "getTokenFromStorage"]),

    hideAll() {
      this.isAccountHomeVisible = false;
      this.isUsersVisible = false;
      this.isScannerVisible = false;
      this.isOrdersVisible = false;
      this.isAddEventVisible = false;
      this.isAccountHomVisible = false;
      this.isBanksVisible = false;
      this.isCategoryVisible = false;
    },
    onClickHomeTab() {
      this.hideAll();
      this.isAccountHomeVisible = true;
      this.mobileTab = "events";
      this.$router
        .push({
          query: {
            activeTab: "events",
          },
        })
        .catch((err) => {});
    },

    onClickOrderTab() {
      this.hideAll();
      this.isOrdersVisible = true;
      this.mobileTab = "orders";
      this.$router
        .push({
          query: {
            activeTab: "orders",
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
    onClickUserTab() {
      this.hideAll();
      this.isUsersVisible = true;
      this.mobileTab = "users";
      this.$router
        .push({
          query: {
            activeTab: "users",
          },
        })
        .catch((err) => {});
    },
    onClickScannerTab() {
      this.hideAll();
      this.isScannerVisible = true;
      this.mobileTab = "scanner";
      this.$router
        .push({
          query: {
            activeTab: "scanner",
          },
        })
        .catch((err) => {});
    },
    onClickBankTab() {
      this.hideAll();
      this.isBanksVisible = true;
      this.mobileTab = "bank";
      this.$router
        .push({
          query: {
            activeTab: "bank",
          },
        })
        .catch((err) => {});
    },

    onClickCategoryTab() {
      this.hideAll();
      this.isCategoryVisible = true;
      this.mobileTab = "categories";
      this.$router
        .push({
          query: {
            activeTab: "categories",
          },
        })
        .catch((err) => {});
    },
    onClickTab() {
      if (this.mobileTab == "event") {
        this.onClickHomeTab();
      } else if (this.mobileTab == "categories") {
        this.onClickCategoryTab();
      } else if (this.mobileTab == "users") {
        this.onClickUserTab();
      } else if (this.mobileTab == "scanner") {
        this.onClickScannerTab();
      } else if (this.mobileTab == "profile") {
        this.onClickProfileTab();
      } else if (this.mobileTab == "email") {
        this.onClickEmailComposeTab();
      } else if (this.mobileTab == "bank") {
        this.onClickBankTab();
      } else if (this.mobileTab === "orders") {
        this.onClickOrderTab();
      } else if (this.mobileTab === "Add Product") {
        this.onClickAddEventTab();
      }
    },
    initialize() {
      if (this.$route.query) {
        if (this.$route.query.activeTab == "event") {
          this.onClickHomeTab();
        } else if (this.$route.query.activeTab == "categories") {
          this.onClickCategoryTab();
        } else if (this.$route.query.activeTab == "users") {
          this.onClickUserTab();
        } else if (this.$route.query.activeTab == "scanner") {
          this.onClickScannerTab();
        } else if (this.$route.query.activeTab == "categories") {
          this.onClickCategoryTab();
        }
      } else if (this.$route.query.activeTab == "bank") {
        this.onClickBankTab();
      } else if (this.$route.query.activeTab == "orders") {
        this.onClickOrderTab();
      } else if (this.$route.query.activeTab == "add-event") {
        this.onClickAddEventTab();
      } else {
        this.onClickHomeTab();
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
