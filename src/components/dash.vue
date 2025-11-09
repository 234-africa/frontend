<template>
  <div class="dashboard-container">
    <div class="dashboard-nav-tabs">
      <div class="nav-tabs-wrapper">
        <button
          @click="onClickHomeTab"
          :class="['tab-button', { active: isAccountHomeVisible }]"
        >
          <i class="bi bi-speedometer2"></i>
          <span>Dashboard</span>
        </button>
        <button
          @click="onClickBankTab"
          :class="['tab-button', { active: isBankVisible }]"
        >
          <i class="bi bi-bank"></i>
          <span>Bank Info</span>
        </button>
        <button
          @click="onClickEventTab"
          :class="['tab-button', { active: isEventVisible }]"
        >
          <i class="bi bi-calendar-event"></i>
          <span>My Events</span>
        </button>
        <button
          @click="onClickAddEventTab"
          :class="['tab-button', { active: isAddEventVisible }]"
        >
          <i class="bi bi-plus-circle"></i>
          <span>Add Event</span>
        </button>
        <button
          @click="onClickOrderTab"
          :class="['tab-button', { active: isOrdersVisible }]"
        >
          <i class="bi bi-people"></i>
          <span>User Management</span>
        </button>
      </div>
    </div>

    <div class="dashboard-content">
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
      isAccountHomeVisible: true,
      isBankVisible: false,
      isOrdersVisible: false,
      isEventVisible: false,
      isAddEventVisible: false,
    };
  },
  watch: {
    "$route.query.activeTab"(to, from) {
      this.initialize();
    },
  },
  computed: {
    ...mapGetters(["isAdmin"]),
  },
  methods: {
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
      this.$router.push({ query: { activeTab: "dashboard" } }).catch(() => {});
    },
    onClickEventTab() {
      this.hideAll();
      this.isEventVisible = true;
      this.$router.push({ query: { activeTab: "event" } }).catch(() => {});
    },
    onClickAddEventTab() {
      this.hideAll();
      this.isAddEventVisible = true;
      this.$router.push({ query: { activeTab: "add-event" } }).catch(() => {});
    },
    onClickBankTab() {
      this.hideAll();
      this.isBankVisible = true;
      this.$router.push({ query: { activeTab: "bank" } }).catch(() => {});
    },
    onClickOrderTab() {
      this.hideAll();
      this.isOrdersVisible = true;
      this.$router.push({ query: { activeTab: "user-management" } }).catch(() => {});
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
  },
};
</script>

<style scoped>
.dashboard-container {
  width: 100%;
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.dashboard-nav-tabs {
  background: white;
  padding: 1rem 2rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  position: sticky;
  top: 0;
  z-index: 100;
}

.nav-tabs-wrapper {
  display: flex;
  gap: 0.5rem;
  overflow-x: auto;
  padding-bottom: 0.5rem;
  scrollbar-width: thin;
  scrollbar-color: #667eea #f1f3f5;
}

.nav-tabs-wrapper::-webkit-scrollbar {
  height: 6px;
}

.nav-tabs-wrapper::-webkit-scrollbar-track {
  background: #f1f3f5;
  border-radius: 10px;
}

.nav-tabs-wrapper::-webkit-scrollbar-thumb {
  background: #667eea;
  border-radius: 10px;
}

.tab-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.8rem 1.5rem;
  background: white;
  border: 2px solid #e9ecef;
  border-radius: 12px;
  color: #495057;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.tab-button i {
  font-size: 1.1rem;
}

.tab-button:hover {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-color: #667eea;
  color: #667eea;
  transform: translateY(-2px);
}

.tab-button.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-color: #667eea;
  color: white;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
}

.tab-button.active:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

.dashboard-content {
  width: 100%;
}

@media (max-width: 768px) {
  .dashboard-nav-tabs {
    padding: 1rem;
  }

  .nav-tabs-wrapper {
    gap: 0.3rem;
  }

  .tab-button {
    padding: 0.7rem 1rem;
    font-size: 0.85rem;
  }

  .tab-button span {
    display: none;
  }

  .tab-button i {
    font-size: 1.3rem;
  }
}

@media (max-width: 576px) {
  .tab-button {
    padding: 0.6rem 0.8rem;
  }

  .tab-button i {
    font-size: 1.2rem;
  }
}
</style>
