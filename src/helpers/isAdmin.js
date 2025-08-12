import jwt_decode from "jwt-decode";

export default function isAdmin(to, from, next) {
  const token = localStorage.getItem("token");
  if (token) {
    try {
      const decodedToken = jwt_decode(token);
      if (decodedToken.isAdmin) {
        next(); // Allow access to the route
      } else {
        next("/"); // Redirect to home if not an admin
      }
    } catch (error) {
      console.error("Error decoding token:", error);
      next("/"); // Redirect to home on error
    }
  } else {
    next("/"); // Redirect to home if no token
  }
}
