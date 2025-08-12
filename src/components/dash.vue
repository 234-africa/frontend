<template>
  <div class="" style="background-color: #fff">
    <div
      class="deznav sidenav"
      id="mySidenav"
      :style="{ width: sidenavWidth + 'px' }"
    >
      <!-- Navigation Bar -->
      <div class="deznav-scroll pt-2">
        <ul
          class="metismenu "
          id="menu"
        >
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
            <ul
              aria-expanded="false"
              v-if="seen"
            >
              <li>
                <a @click="onClickHomeTab">
                  <div :class="{
                    'text-blue': isAccountHomeVisible,
                    grey: !isAccountHomeVisible,
                  }">
                    Dashboard
                  </div>
                </a>
              </li>
              <li>
                <a @click="onClickHomTab" class="d-none">
                  <div :class="{
                    'text-blue': isAccountHomVisible,
                    grey: !isAccountHomVisible,
                  }">
                    Reviews
                  </div>
                </a>
              </li>
              <li>
                <a @click="onClickWalletTab()" class="d-none">
                  <div :class="{
                    'text-blue': isAnalyticsVisible,
                    grey: !isAnalyticsVisible,
                  }">
                    Analytics
                  </div>
                </a>
              </li>
              <li @click="onClickOrderTab">
                <a>
                  <div :class="{
                    'text-blue': isOrdersVisible,
                    grey: !isOrdersVisible,
                  }">
                    Order List
                  </div>
                </a>
              </li>
              <li>
                <a @click="onClickCustomerTab()" class="d-none">
                  <div :class="{
                    'text-blue white': isCustomerVisible,
                    grey: !isCustomerVisible,
                  }">
                    General Customers
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
            <ul
              v-if="see"
              aria-expanded="false"
            >
              <li :class="{
                'text-blue': isCalenderVisible,
                grey: !isCalenderVisible,
              }">
                <a @click="onClickBankTab">Bank Info</a>
              </li>
              <li :class="{
                'text-blue': isProductVisible,
                grey: !isProductVisible,
              }">
                <a @click="onClickProductTab">My Event</a>
              </li>
              <li :class="{
                'text-blue': isAddProductVisible,
                grey: !isAddProductVisible,
              }">
                <a @click="onClickAddProductTab">Add Event</a>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
    <!-- Content Section -->
    <div
      id="main"
      :style="{ marginLeft: sidenavWidth + 'px' }"
    >
     <div class="d-block d-sm-none padding-left-10 padding-bottom-0">
  <div class="dropdown form-control p-2" @click="toggleDropdown" style="width:fit-content;">
    <a class="dropdown-toggle" :class="{ 'active': isDropdownOpen }">
      {{ mobileTab }}
    </a>
    <div class="dropdown-menu" :class="{ 'show': isDropdownOpen }">
      <a class="dropdown-item" @click="onClickHomeTab">Dashboard</a>
      <a class="dropdown-item d-none" @click="onClickHomTab">Reviews</a>
      <a class="dropdown-item d-none" @click="onClickWalletTab">Analytics</a>
      <a class="dropdown-item" @click="onClickOrderTab">Order List</a>
      <a class="dropdown-item d-none" @click="onClickCustomerTab">General Customers</a>
      <a class="dropdown-item" @click="onClickBankTab">Bank Info</a>
      <a class="dropdown-item" @click="onClickProductTab">My Event</a>
      <a class="dropdown-item" @click="onClickAddProductTab">Add Event</a>
    </div>
  </div>
</div>


      <span
        style="font-size: 30px; cursor: pointer"
        @click="toggleNav"
        class="d-none d-md-block"
      >
        {{ isNavOpen ? '×' : '☰' }} {{ isNavOpen ? '' : '' }}
      </span>
      <div>
        <Dashboard v-if="isAccountHomeVisible"></Dashboard>
      </div>
      <div>
        <Dashboar v-if="isAccountHomVisible"></Dashboar>
      </div>
      <div>
        <Analytics v-if="isAnalyticsVisible"></Analytics>
      </div>
      <div>
        <Customer v-if="isCustomerVisible"></Customer>
      </div>
      <div>
        <Orders v-if="isOrdersVisible"></Orders>
      </div>
      <div>
        <Profile v-if="isProfileVisible"></Profile>
      </div>
      <div>
        <Compose v-if="isEmailComposeVisible"></Compose>
      </div>
      <div>
        <Calender v-if="isCalenderVisible"></Calender>
      </div>
      <div>
        <Product v-if="isProductVisible"></Product>
      </div>
      <div>
        <addProduct v-if="isAddProductVisible"></addProduct>
      </div>
    </div>
  </div>
</template>
<script>
import { mapActions, mapGetters } from "vuex";
import Analytics from "./dashboard/analytics.vue";
import Dashboard from "./dashboard/dashboard.vue";
import Dashboar from "./dashboard/dashboar.vue";
import Customer from "./dashboard/customers.vue";
import Orders from "./dashboard/orderlist.vue";
import Profile from "./app/profile.vue";
import Compose from "./app/email.vue";
import Calender from "./app/bank.vue";
import Product from "./app/product.vue";
import addProduct from "./app/addProduct.vue";

export default {
  components: {
    Analytics,
    Dashboard,
    Dashboar,
    Product,
    Profile,
    Compose,
    Calender,
    addProduct,
    Customer,
    Orders
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
      isAccountHomVisible: true,
      isAnalyticsVisible: true,
      isCustomerVisible: true,
      isCalenderVisible: false,
      isOrdersVisible: false,
      isProfileVisible: false,
      isProductVisible: false,
      isAddProductVisible: false,

      isEmailComposeVisible: false
    };
  },
  watch: {
    "$route.query.activeTab"(to, from) {
      // Only triggers when activeTab changes
      this.$router
        .push({
          query: {
            activeTab: to
          }
        })
        .catch(err => {});
      this.initialize();
    }
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
      this.isAnalyticsVisible = false;
      this.isCustomerVisible = false;
      this.isCalenderVisible = false;
      this.isOrdersVisible = false;
      this.isProfileVisible = false;
      this.isEmailComposeVisible = false;
      this.isProductVisible = false;
      this.isAddProductVisible = false;

      this.isAccountHomVisible = false;
    },
    onClickHomeTab() {
      this.hideAll();
      this.isAccountHomeVisible = true;
      this.mobileTab = "Dashboard";
      this.$router
        .push({
          query: {
            activeTab: "dashboard"
          }
        })
        .catch(err => {});
    },
    onClickProfileTab() {
      this.hideAll();
      this.isProfileVisible = true;
      this.mobileTab = "profile";
      this.$router
        .push({
          query: {
            activeTab: "profile"
          }
        })
        .catch(err => {});
    },
    onClickProductTab() {
      this.hideAll();
      this.isProductVisible = true;
      this.mobileTab = "product";
      this.$router
        .push({
          query: {
            activeTab: "product"
          }
        })
        .catch(err => {});
    },
    onClickAddProductTab() {
      this.hideAll();
      this.isAddProductVisible = true;
      this.mobileTab = "add-product";
      this.$router
        .push({
          query: {
            activeTab: "add-product"
          }
        })
        .catch(err => {});
    },
    onClickHomTab() {
      this.hideAll();
      this.isAccountHomVisible = true;
      this.mobileTab = "reviews";
      this.$router
        .push({
          query: {
            activeTab: "reviews"
          }
        })
        .catch(err => {});
    },
    onClickWalletTab() {
      this.hideAll();
      this.isAnalyticsVisible = true;
      this.mobileTab = "analytics";
      this.$router
        .push({
          query: {
            activeTab: "analytics"
          }
        })
        .catch(err => {});
    },
    onClickCustomerTab() {
      this.hideAll();
      this.isCustomerVisible = true;
      this.mobileTab = "customer";
      this.$router
        .push({
          query: {
            activeTab: "customer"
          }
        })
        .catch(err => {});
    },
    onClickBankTab() {
      this.hideAll();
      this.isCalenderVisible = true;
      this.mobileTab = "Calendar";
      this.$router
        .push({
          query: {
            activeTab: "bank"
          }
        })
        .catch(err => {});
    },
    onClickEmailComposeTab() {
      this.hideAll();
      this.isEmailComposeVisible = true;
      this.mobileTab = "email";
      this.$router
        .push({
          query: {
            activeTab: "email"
          }
        })
        .catch(err => {});
    },

    onClickOrderTab() {
      this.hideAll();
      this.isOrdersVisible = true;
      this.mobileTab = "orders";
      this.$router
        .push({
          query: {
            activeTab: "orders"
          }
        })
        .catch(err => {});
    },
    onClickTab() {
      if (this.mobileTab == "dashboard") {
        this.onClickHomeTab();
      } else if (this.mobileTab == "reviews") {
        this.onClickHomTab();
      } else if (this.mobileTab == "analytics") {
        this.onClickWalletTab();
      } else if (this.mobileTab == "customer") {
        this.onClickCustomerTab();
      } else if (this.mobileTab == "orders") {
        this.onClickOrderTab();
      } else if (this.mobileTab == "profile") {
        this.onClickProfileTab();
      } else if (this.mobileTab == "email") {
        this.onClickEmailComposeTab();
      } else if (this.mobileTab == "bank") {
        this.onClickBankTab();
      } else if (this.mobileTab === "Product") {
        this.onClickProductTab();
      } else if (this.mobileTab === "Add Product") {
        this.onClickAddProductTab();
      }
    },
    initialize() {
      if (this.$route.query) {
        if (this.$route.query.activeTab == "dashboard") {
          this.onClickHomeTab();
        } else if (this.$route.query.activeTab == "reviews") {
          this.onClickHomTab();
        } else if (this.$route.query.activeTab == "analytics") {
          this.onClickWalletTab();
        } else if (this.$route.query.activeTab == "customer") {
          this.onClickCustomerTab();
        } else if (this.$route.query.activeTab == "orders") {
          this.onClickOrderTab();
        } else if (this.$route.query.activeTab == "profile") {
          this.onClickProfileTab();
        } else if (this.$route.query.activeTab == "email") {
          this.onClickEmailComposeTab();
        } else if (this.$route.query.activeTab == "bank") {
          this.onClickBankTab();
        } else if (this.$route.query.activeTab == "product") {
          this.onClickProductTab();
        } else if (this.$route.query.activeTab == "add-product") {
          this.onClickAddProductTab();
        } else {
          this.onClickHomeTab();
        }
      }
    }
  },
  mounted() {

    this.initialize();
      window.addEventListener("resize", this.Resize);
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.Resize);
  }
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