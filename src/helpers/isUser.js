// router/guards/isUser.js
import store from "../store";

export default async function isUser(to, from, next) {
  try {
    // If no user in store but token exists, fetch user
    if (!store.getters.getUser && localStorage.getItem("token")) {
      await store.dispatch("getUser");
    }

    if (store.getters.isUser) {
      next(); // ✅ user allowed
    } else {
      next("/login"); // ❌ redirect to login
    }
  } catch (error) {
    console.error("User guard error:", error);
    next("/login");
  }
}
