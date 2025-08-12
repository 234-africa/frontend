import axios from "axios";

const state = {
  cart: [],
    selectedTickets: [],
  cartLength: 0,
  shippingPrice: 0,
  cartTotal: 0,
  shippingEstimatedDelivery: "",
  productUrl: "",
  selectedCountry: "", // Store country name
  selectedState: "", // Store state name
  selectedCity: "",
  selectedName: "", // Store city name
  selectedAddress: "", // Store address name
  seletedPhone: "",
};

const getters = {
    getSelectedTickets(state) {
    return state.selectedTickets;
  },
   getCartTotal(state) {
    return state.cart.reduce((sum, product) => {
      const ticketTotal = product.event.tickets.reduce((innerSum, ticket) => {
        return (
          innerSum + (ticket.selectedQuantity || 0) * (ticket.price || 0)
        );
      }, 0);
      return sum + ticketTotal;
    }, 0);
  },
    getDeliveryInfo(state) {
    return {
      country: state.selectedCountry,
      state: state.selectedState,
      city: state.selectedCity,
      name: state.selectedName,
      address: state.selectedAddress,
      phone: state.seletedPhone,
    };
  },
  getProductUrl: (state) => state.productUrl,

  getCartLength(state) {
    return state.cartLength;
  },
  getCart(state) {
    return state.cart;
  },
  getCartTotalPrice(state) {
    let total = 0;
    state.cart.map((product) => {
      total += product.price * product.quantity;
    });

    return total;
  },
  getCartTotalPriceWithShipping(state) {
    let total = 0;
    state.cart.map((product) => {
      total += product.price * product.quantity;
    });

    return total + state.shippingPrice;
  },
  getEstimatedDelivery(state) {
    return state.shippingEstimatedDelivery;
  },
  isLoggedIn: (state) => !!state.token,
  authStatus: (state) => state.status,
};

const actions = {
  saveDeliveryInfo({ commit }, formData) {
    commit("setDeliveryInfo", formData);
  },
   calculateCartTotal({ commit, state }) {
    const total = state.cart.reduce((sum, product) => {
      const ticketTotal = product.event.tickets.reduce((innerSum, ticket) => {
        return (
          innerSum + (ticket.selectedQuantity || 0) * (ticket.price || 0)
        );
      }, 0);
      return sum + ticketTotal;
    }, 0);

    commit("SET_CART_TOTAL", total);
  },
  setProductUrl({ commit }, url) {
    commit("setProductUrl", url);
  },
addProductToCart({ state, commit }, product) {
  // Ensure product has a unique ID if not already set
  if (!product._id) {
    product._id = `${product.title}-${Date.now()}`;
  }

  // Clear existing cart (only one item allowed)
  commit("clearCart");

  // Add the new product with quantity 1
  commit("pushProductToCart", { ...product, quantity: 1 });
  commit("setCartLength", 1); // explicitly set cart length to 1

  console.log("cart (only one item):", state.cart);
},

  clearCart({ commit }) {
    commit("clearCart");
  },
};

const mutations = {
   setSelectedTickets(state, tickets) {
    state.selectedTickets = tickets;
  },
  SET_CART_TOTAL(state, total) {
    state.cartTotal = total;
  },
  setDeliveryInfo(state, payload) {
    state.selectedCountry = payload.selectedCountry;
    state.selectedState = payload.selectedState;
    state.selectedCity = payload.selectedCity;
    state.selectedName = payload.selectedName;
    state.selectedAddress = payload.selectedAddress;
    state.seletedPhone = payload.selectedPhone;
  },
  setProductUrl(state, url) {
    state.productUrl = url;
  },

  pushProductToCart(state, product) {
    product.quantity = 1;
    state.cart.push(product);
  },

  incrementProductQty(state, product) {
    product.quantity++;
    let indexOfProduct = state.cart.indexOf(product);
    state.cart.splice(indexOfProduct, 1, product);
  },

  incrementCartLength(state) {
    state.cartLength = 0;
    if (state.cart.length > 0) {
      state.cart.map((product) => {
        state.cartLength += product.quantity;
      });
    }
  },
  /*
      1. Find the product in the cart
      2. Change the quantity of the product
      3. Update the length of the cart
      4. replace the old product with the updated product
      */
  changeQty(state, { product, qty }) {
    let cartProduct = state.cart.find((prod) => prod._id === product._id);
    cartProduct.quantity = qty;

    state.cartLength = 0;
    if (state.cart.length > 0) {
      state.cart.map((product) => {
        state.cartLength += product.quantity;
      });
    }

    let indexOfProduct = state.cart.indexOf(cartProduct);
    state.cart.splice(indexOfProduct, 1, cartProduct);
  },
  /*
      1. remove the product quantity from the cartLength
      2. get the index of the product that we want to delete
      3. remove that product by using splice
      */
  removeProduct(state, product) {
    state.cartLength -= product.quantity;
    let indexOfProduct = state.cart.indexOf(product);
    state.cart.splice(indexOfProduct, 1);
  },

  setShipping(state, { price, estimatedDelivery }) {
    state.shippingPrice = price;
    state.shippingEstimatedDelivery = estimatedDelivery;
  },

  clearCart(state) {
    state.cart = [];
    state.cartLength = 0;
    state.shippingPrice = 0;
    state.shippingEstimatedDelivery = "";
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
