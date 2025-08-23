// router/guards/isUser.js
import store from "../store";

export default function isUser(to, from, next) {
  if (store.getters.isUser) {
    next(); // ✅ user allowed
  } else {
    next("/login"); // 🚫 redirect if not user
  }
}
