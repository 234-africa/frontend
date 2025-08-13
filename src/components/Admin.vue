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
          <!-- events -->
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
              <span class="nav-text">All</span>
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
                    Events
                  </div>
                </a>
              </li>
              <li>
                <a @click="onClickCategoryTab" class="">
                  <div
                    :class="{
                      'text-blue': isAccountHomVisible,
                      grey: !isAccountHomVisible,
                    }"
                  >
                    category
                  </div>
                </a>
              </li>
              <li>
                <a @click="onClickUserTab()" class="">
                  <div
                    :class="{
                      'text-blue': isUsersVisible,
                      grey: !isUsersVisible,
                    }"
                  >
                    Users
                  </div>
                </a>
              </li>

              <li>
                <a @click="onClickScannerTab()" class="">
                  <div
                    :class="{
                      'text-blue white': isScannerVisible,
                      grey: !isScannerVisible,
                    }"
                  >
                    Scanner
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
                  'text-blue': isCalenderVisible,
                  grey: !isCalenderVisible,
                }"
              >
                <a @click="onClickBankTab">Bank Info</a>
              </li>
              <li
                :class="{
                  'text-blue': isOrderVisible,
                  grey: !isOrderVisible,
                }"
              >
                <a @click="onClickOrderTab">orders</a>
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
            <a class="dropdown-item" @click="onClickHomeTab">events</a>
            <a class="dropdown-item" @click="onClickCategoryTab"
              >categories</a
            >
            <a class="dropdown-item" @click="onClickUserTab">users</a>
           
            <a class="dropdown-item " @click="onClickScannerTab"
              >scanner</a
            >
            <a class="dropdown-item" @click="onClickBankTab">Bank Info</a>
            <a class="dropdown-item" @click="onClickOrderTab">orders</a>
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
        <events v-if="isAccountHomeVisible"></events>
      </div>
      <div>
        <category v-if="isCategoryVisible"></category>
      </div>
      <div>
        <users v-if="isUsersVisible"></users>
      </div>
      <div>
        <Scanner v-if="isScannerVisible"></Scanner>
      </div>
      <div>
        <Orders v-if="isOrdersVisible"></Orders>
      </div>
      <div>
        <banks v-if="isBanksVisible"></banks>
      </div>
      <div>
        <addEvent v-if="isAddEventVisible"></addEvent>
      </div>
    </div>
  </div>
</template>
<script>
import { mapActions, mapGetters } from "vuex";

import Events from "./app/admin/events.vue";
import Orders from "./app/admin/orders.vue";
import Scanner from "./app/admin/scanner.vue";
import Banks from "./app/admin/bank.vue"
import Users from "./app/admin/users.vue";
import addEvent from "./app/admin/addEvent.vue"


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
      se: true,
      sidenavWidth: 0,
      isDropdownOpen: false,
      isNavOpen: false,

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
      this.isBanksVisible=false;
      this.isCategoryVisible=false
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
      }
    
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
