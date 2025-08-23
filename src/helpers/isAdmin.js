// router/guards/isAdmin.js
import store from "../store";

export default function isAdmin(to, from, next) {
  if (store.getters.isAdmin) {
    next(); // ✅ admin allowed
  } else {
    next("/login"); // 🚫 redirect if not admin
  }
}
