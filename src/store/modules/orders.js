// store/index.js

import axiosInstance from "../../helpers/axiosInstance";

const state = {
  orders: [],
    ordersByUser: [],
};
const mutations = {
  SET_ORDERS(state, orders) {
    state.orders = orders;
  },
  SET_ORDERS_BY_USER(state, orders) {
    state.getOrdersByUser = orders;
  },
};
const actions = {
  updateOrderStatus({ commit }, { orderId, status }) {
    return new Promise((resolve, reject) => {
      axiosInstance
        .put(`/order/${orderId}/update-status`, { status })
        .then((response) => {
          const order = response.data.order;
          // Handle the updated order data as needed
          // For example, commit a mutation to update the order state in the store
          // commit('UPDATE_ORDER', order);

          resolve();
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  fetchOrdersByUser({ commit }) {
    return axiosInstance
      .get("/user/orders")
      .then((response) => {
        CONSOLE.log(response);
        
        commit("SET_ORDERS_BY_USER", response.data.products);
      })
      .catch((error) => {
        console.error(error);
      });
  },
  fetchOrders({ commit }) {
    return axiosInstance
      .get("/orders")
      .then((response) => {
        commit("SET_ORDERS", response.data.products);
      })
      .catch((error) => {
        console.error(error);
      });
  },
};
const getters = {
  getOrders(state) {
    return state.orders;
  },
    getOrdersByUser(state) {    
    return state.ordersByUser;
    },
  getOrdersLength: (state) => state.orders.length,
  deliveredCount(state) {
    return state.orders.filter((order) => order.status === "delivered").length;
  },
  cancelledCount(state) {
    return state.orders.filter((order) => order.status === "cancelled").length;
  },
  onDeliveryCount(state) {
    return state.orders.filter((order) => order.status === "on Delivery")
      .length;
  },

  totalPercent(state) {
    const totalOrders = state.orders.length;
    // console.log(state.products.products.length)
    return totalOrders / 100;
  },
  totalOrdersPrice: (state) => {
    let total = 0;
    state.orders.forEach((order) => {
      if (Array.isArray(order.products)) {
        order.products.forEach((product) => {
          total += product.totalPrice || 0;
        });
      }
    });
    return total;
  },

  totalOrdersPercentage: (state, getters) => {
    const totalOrders = getters.totalOrdersPrice;
    //const totalSales = getters.totalSales;
    return totalOrders / 100;
  },
};

export default {
  state,
  mutations,
  actions,
  getters,
};
