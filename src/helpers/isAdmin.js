// router/guards/isAdmin.js
import store from "../store";

export default async function isAdmin(to, from, next) {
  try {
    // If user isn't loaded but a token exists, fetch user
    if (!store.getters.getUser && localStorage.getItem("token")) {
      await store.dispatch("getUser");
    }

    if (store.getters.isAdmin) {
      next(); // ✅ Admin allowed
    } else {
      next("/login"); // 🚫 Redirect if not admin
    }
  } catch (error) {
    console.error("Admin guard error:", error);
    next("/login");
  }
}
