<template>
  <div class="nav-wrapper text-dark">
    <!-- ☰ Toggle for Mobile -->
    <div
      class="d-flex justify-content-between align-items-center d-md-none px-4 pe-4"
    >
      <div>
        <router-link
          class="text-white text-decoration-none d-block d-md-none"
          to="/"
        >
          <img
            src="/IMG_0264.PNG"
            style="height: 50px; width: 70px"
            alt="Logo"
          />
        </router-link>
      </div>
      <button class="toggle-btn bg-none" @click="show = !show">☰</button>
    </div>

    <!-- Mobile Slide-in Nav -->
    <transition name="slide-right" mode="out-in">
      <div v-if="show" class="side-nav">
        <button class="close-btn" @click="show = false">×</button>
        <ul class="nav-list">
          <li class="nav-item"></li>
          <li class="nav-item">
            <router-link class="text-white text-decoration-none" to="/events"
              >Events</router-link
            >
          </li>
          <li class="nav-item" v-if="!getToken">
            <router-link class="text-white text-decoration-none" to="/login"
              >Login</router-link
            >
          </li>
          <li class="nav-item">
            <router-link class="text-white text-decoration-none" to="/register"
              >Register</router-link
            >
          </li>
        </ul>
      </div>
    </transition>

    <!-- Desktop Nav: Hello right, nav right -->
    <div
      class="d-flex hide-on-mobile d-none d-md-flex px-4 pe-4 justify-content-between align-items-center"
    >
      <div class="text-white fw-bold" style="">
        <router-link class="text-white text-decoration-none" to="/">
          <img
            src="/IMG_0264.PNG"
            alt="Logo"
            style="width: 100px; height: 65px"
          />
        </router-link>
      </div>

      <!-- From Uiverse.io by SelfMadeSystem -->
      <div class="nav"></div>
      <div class="">
        <div
          class="d-flex justify-content-between align-items-center nav-inner"
        >
         

          <div>
            <router-link
              to="/login"
              v-if="!getToken"
              class="p-2"
              style="
                color: #047143;
                text-decoration: none;
              
                border-radius: 0;
                transition: all 0.3s;
              "
              @mouseover="
                (e) => {
                  e.target.style.backgroundColor = '#d4edda';
                  e.target.style.borderRadius = '20px';
                }
              "
              @mouseout="
                (e) => {
                  e.target.style.backgroundColor = 'transparent';
                  e.target.style.borderRadius = '0';
                }
              "
            >
              Login
            </router-link>
          </div>

          <div>
            <router-link
              to="/register"
              v-if="!getToken"
                class="p-2"
              style="
                color: #047143;
                text-decoration: none;
              
                border-radius: 0;
                transition: all 0.3s;
              "
              @mouseover="
                (e) => {
                  e.target.style.backgroundColor = '#d4edda';
                  e.target.style.borderRadius = '20px';
                }
              "
              @mouseout="
                (e) => {
                  e.target.style.backgroundColor = 'transparent';
                  e.target.style.borderRadius = '0';
                }
              "
            >
              Register
            </router-link>
          </div>
          
            <router-link v-if="getToken" class="p-2"  style="
                color: #047143;
                text-decoration: none;
               
                border-radius: 0;
                transition: all 0.3s;
              "
              @mouseover="
                (e) => {
                  e.target.style.backgroundColor = '#d4edda'; // Light green background on hover
                  e.target.style.borderRadius = '20px'; // Rounded border on hover
                }
              "
              @mouseout="
                (e) => {
                  e.target.style.backgroundColor = 'transparent';
                  e.target.style.borderRadius = '0';
                }
              " :to="`/dash`">Dashboard</router-link>
          
           <div>
            <router-link
              to="/events"
              class="p-2"
              style="
                color: #047143;
                text-decoration: none;
               
                border-radius: 0;
                transition: all 0.3s;
              "
              @mouseover="
                (e) => {
                  e.target.style.backgroundColor = '#d4edda'; // Light green background on hover
                  e.target.style.borderRadius = '20px'; // Rounded border on hover
                }
              "
              @mouseout="
                (e) => {
                  e.target.style.backgroundColor = 'transparent';
                  e.target.style.borderRadius = '0';
                }
              "
            >
              Events
            </router-link>
          </div>
          <a class=""  v-if="getToken" @click="logout"> Logout </a>

          <div class="dropdown">
            <button
              type="button"
              class="btn  d-flex align-items-center gap-2"
           
             v-if="getToken" 
              aria-expanded="false"
            >
              <!-- Name and Image in Flex -->
              <span class="mr-2 text-primary ">Hello, <strong>{{ currentUser && currentUser.name ? currentUser.name : 'Guest' }}</strong></span>
                    <img
                      v-if="currentUser"
                      :src="currentUser.picture"
                      alt=""
                      width="32"
                      height="32"
                      class="rounded-circle"
                    >
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

export default {
  components: {},
  data() {
    return {
      show: false,
    };
  },
  computed: {
    ...mapGetters(["currentUser", "isAdmin", "error", "getToken"]),
  },
  methods: {
    ...mapActions(["getUser", "getTokenFromStorage", "logout"]),
  },

  mounted() {
    this.getUser()
      .then((user) => {
        // console.log("User:", user);
      })
      .catch((error) => {
        // console.log("Error:", error);
      });
  },
  created() {
    this.getTokenFromStorage();
  },
};
</script>

<style scoped>
/* ===== General Layout ===== */
.hov:hover {
  background-color: #047143;
  text-decoration: none;
  color: white;
}
.nav-wrapper {
  color: dark;
  padding: 1rem 0;
  overflow-x: hidden;
}

/* ===== MOBILE ===== */
.toggle-btn {
  background: none;
  color: green;
  border: none;
  padding: 10px;
  border-radius: 4px;
  font-size: 1.5rem;
  cursor: pointer;
  display: inline-block;
}

.side-nav {
  position: fixed;
  top: 0;
  right: 0;
  height: 100%;
  width: 250px;
  background: #047143;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.2);
  padding: 2rem 1rem;
  z-index: 1000;
}

.close-btn {
  background: none;
  border: none;
  color: white;
  font-size: 2rem;
  position: absolute;
  top: 10px;
  right: 15px;
  cursor: pointer;
}

.nav-list {
  list-style: none;
  padding: 0;
  margin-top: 2rem;
}

.nav-item {
  padding: 1rem 0;
  font-size: 1.2rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  cursor: pointer;
}

.nav-item:hover {
  color: #00a8cc;
}

.slide-right-enter-active,
.slide-right-leave-active {
  transition: transform 0.3s ease, opacity 0.3s ease;
}
.slide-right-enter-from,
.slide-right-leave-to {
  transform: translateX(100%);
  opacity: 0;
}

/* ===== DESKTOP ===== */
.nav-desktop {
  display: none;
}
@media (max-width: 767.98px) {
  .hide-on-mobile {
    display: none !important;
  }
}

@media screen and (min-width: 768px) {
  .toggle-btn,
  .side-nav {
    display: none;
  }

  .nav-desktop {
    display: flex;
    align-items: center;
  }

  .nav-inner {
    position: relative;
    display: flex;
    gap: 2rem;
    padding: 0.5rem 1rem;
    align-items: center;
  }

  .btn {
    color: white;
    background: transparent;
    border: none;
    cursor: pointer;
    white-space: nowrap;
    z-index: 1;
    font-weight: 500;
    padding: 0.4rem 0.8rem;
  }

  .btn:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }

  /* SVG Outline */ /* From Uiverse.io by SelfMadeSystem */
  .outline {
    position: absolute;
    inset: 0;
    pointer-events: none;
  }

  .rect {
    stroke-dashoffset: 5;
    stroke-dasharray: 0 0 10 40 10 40;
    transition: 0.5s;
    stroke: #047143;
  }

  .nav {
    position: relative;
    width: 400px;
    height: 60px;
  }

  .container:hover .outline .rect {
    transition: 999999s;
    /* Must specify these values here as something *different* just so that the transition works properly */
    stroke-dashoffset: 1;
    stroke-dasharray: 0;
  }

  .container {
    position: absolute;
    inset: 0;

    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    padding: 0.5em;
  }

  .btn {
    padding: 5px;
    color: #fff;
    cursor: pointer;
    transition: 0.1s;
  }

  .btn:hover {
    background: #fff3;
  }

  .btn:nth-child(1):hover ~ svg .rect {
    stroke-dashoffset: 0;
    stroke-dasharray: 0 2 8 73.3 8 10.7;
  }

  .btn:nth-child(2):hover ~ svg .rect {
    stroke-dashoffset: 0;
    stroke-dasharray: 0 12.6 9.5 49.3 9.5 31.6;
  }

  .btn:nth-child(3):hover ~ svg .rect {
    stroke-dashoffset: 0;
    stroke-dasharray: 0 24.5 8.5 27.5 8.5 55.5;
  }

  .btn:nth-child(4):hover ~ svg .rect {
    stroke-dashoffset: 0;
    stroke-dasharray: 0 34.7 6.9 10.2 6.9 76;
  }

  .btn:hover ~ .outline .rect {
    stroke-dashoffset: 0;
    stroke-dasharray: 0 0 10 40 10 40;
    transition: 0.5s !important;
  }
}
</style>
