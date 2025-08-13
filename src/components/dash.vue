<template>
  <div class="" style="background-color: #fff">
    <div
      class="deznav sidenav"
      id="mySidenav"
      :style="{ width: sidenavWidth + 'px' }"
    >
      <!-- Navigation Bar -->
      <div class="deznav-scroll pt-2">
        <ul class="metismenu" id="menu">
          <!-- Dashboard -->
          <li>
            <a
              v-if="seen"
              class="has-arrow ai-icon"
              :class="{
                'bg-inf text-info': seen,
                grey: !seen,
              }"
              @click="seen = !seen"
              aria-expanded="false"
            >
              <i v-if="!isTablet" class="flaticon-381-networking"></i>
              <span class="nav-text">Dashboard</span>
            </a>
            <ul aria-expanded="false" v-if="seen">
              <li>
                <a @click="onClickHomeTab">
                  <div
                    :class="{
                      'text-blue': isAccountHomeVisible,
                      grey: !isAccountHomeVisible,
                    }"
                  >
                    Dashboard
                  </div>
                </a>
              </li>

              <li @click="onClickOrderTab">
                <a>
                  <div
                    :class="{
                      'text-blue': isOrdersVisible,
                      grey: !isOrdersVisible,
                    }"
                  >
                    Order List
                  </div>
                </a>
              </li>
            </ul>
          </li>
          <!-- Apps -->
          <li>
            <a
              class="has-arrow ai-icon"
              :class="{
                'bg-inf text-info': see,
                grey: !see,
              }"
              @click="see = !see"
              aria-expanded="false"
            >
              <i class="flaticon-381-television"></i>
              <span class="nav-text">Apps</span>
            </a>
            <ul v-if="see" aria-expanded="false">
              <li
                :class="{
                  'text-blue': isBankVisible,
                  grey: !isBankVisible,
                }"
              >
                <a @click="onClickBankTab">Bank Info</a>
              </li>
              <li
                :class="{
                  'text-blue': isEventVisible,
                  grey: !isEventVisible,
                }"
              >
                <a @click="onClickEventTab">My Event</a>
              </li>
              <li
                :class="{
                  'text-blue': isAddEventVisible,
                  grey: !isAddEventVisible,
                }"
              >
                <a @click="onClickAddEventTab">Add Event</a>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
    <!-- Content Section -->
    <div id="main" :style="{ marginLeft: sidenavWidth + 'px' }">
      <div class="d-block d-sm-none padding-left-10 padding-bottom-0">
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
            <a class="dropdown-item" @click="onClickOrderTab">Order List</a>
            <a class="dropdown-item" @click="onClickBankTab">Bank Info</a>
            <a class="dropdown-item" @click="onClickEventTab">My Event</a>
            <a class="dropdown-item" @click="onClickAddEventTab">Add Event</a>
          </div>
        </div>
      </div>

      <span
        style="font-size: 30px; cursor: pointer"
        @click="toggleNav"
        class="d-none d-md-block"
      >
        {{ isNavOpen ? "×" : "☰" }} {{ isNavOpen ? "" : "" }}
      </span>
      <div>
        <Dashboard v-if="isAccountHomeVisible"></Dashboard>
      </div>

      <div>
        <Orders v-if="isOrdersVisible"></Orders>
      </div>

      <div>
        <Bank v-if="isBankVisible"></Bank>
      </div>
      <div>
        <event v-if="isEventVisible"></event>
      </div>
      <div>
        <addEvent v-if="isAddEventVisible"></addEvent>
      </div>
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
      isNavOpen: false,

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
      this.mobileTab = "orders";
      this.$router
        .push({
          query: {
            activeTab: "orders",
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
        } else if (this.$route.query.activeTab == "orders") {
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
<style>
.bg-inf {
  background-color: #f4f6fd;
}
.text {
  color: #2f4cde;
}
.toggle-button {
  padding: 10px 20px;
  background-color: #f2f2f2;
  border: 1px solid #ccc;
  cursor: pointer;
}

.sidenav {
  height: 100%;
  width: 0;
  position: fixed;
  z-index: 1;
  top: 0;
  left: 0;

  overflow-x: hidden;
  transition: 0.5s;
  padding-top: 60px;
}

.sidenav a {
  padding: 8px 8px 8px 32px;
  text-decoration: none;
  font-size: 25px;
  color: #818181;
  display: block;
  transition: 0.3s;
}

.sidenav a:hover {
  color: #f1f1f1;
}

.sidenav .closebtn {
  position: absolute;
  top: 0;
  right: 25px;
  font-size: 36px;
  margin-left: 50px;
}

#main {
  transition: margin-left 0.5s;
  padding: 16px;
}

@media screen and (max-height: 450px) {
  .sidenav {
    padding-top: 15px;
  }
  .sidenav a {
    font-size: 18px;
  }
}
.section {
  margin-top: 20px;
  padding: 20px;
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  width: 100%;
  box-sizing: border-box;
}
.push-right {
  margin-left: 250px; /* Adjust this value according to your needs */
}
.page-content {
  width: auto;
  padding: 20px;
  background-color: #f9f9f9;
  border: 1px solid #ddd;
}
</style>
