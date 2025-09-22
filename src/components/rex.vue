<template>
  <div>
    <!-- Open Sidebar Button -->
    <button class="btn btn-primary m-2" @click="openSidebar">Open Sidebar</button>

    <!-- Sidebar Overlay -->
    <div class="sidebar-overlay" v-if="isOpen" @click.self="closeSidebar"></div>

    <!-- Sidebar -->
    <div :class="['sidebar', { 'sidebar-open': isOpen }]">
      <div class="sidebar-header d-flex justify-content-between align-items-center p-3">
        <h5 class="mb-0 text-white">Menu</h5>
        <button class="btn btn-sm btn-light" @click="closeSidebar">×</button>
      </div>
      <div class="sidebar-content p-3 text-white">
        <ul class="list-unstyled">
          <li><a href="#" class="text-white">Home</a></li>
          <li><a href="#" class="text-white">Profile</a></li>
          <li><a href="#" class="text-white">Settings</a></li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "SideNav",
  data() {
    return {
      isOpen: false,
    };
  },
  methods: {
    openSidebar() {
      this.isOpen = true;
    },
    closeSidebar() {
      this.isOpen = false;
    },
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
