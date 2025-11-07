// import Vue from 'vue';
// import Vuex from 'vuex';
import {
  createStore
} from 'vuex'
import createPersistedState from "vuex-persistedstate";
import orders from './modules/orders'
import products from './modules/products'
import auth from './modules/auth'
import cart from './modules/cart'
import revenue from './modules/revenue'
import events from './modules/events'
import reviews from './modules/reviews'
import address from './modules/address'



// Vue.use(Vuex);


export default createStore({
  plugins: [createPersistedState()],

  state: {
    currency: 'NGN',
    currencyRates: {
      NGN: 1,
      USD: 0.0012,
      EUR: 0.0011,
      GHS: 0.019,
      GBP: 0.0005
    },
    currencySymbols: {
      NGN: '₦',
      USD: '$',
      EUR: '€',
      GHS: 'GH₵',
      GBP: '£'
    }
  },

  mutations: {
    SET_CURRENCY(state, currency) {
      state.currency = currency;
    }
  },

  actions: {
    setCurrency({ commit }, currency) {
      commit('SET_CURRENCY', currency);
    }
  },

  getters: {
    currency: state => state.currency,
    currencySymbol: state => state.currencySymbols[state.currency],
    convertPrice: state => (price) => {
      const rate = state.currencyRates[state.currency];
      return (price * rate).toFixed(2);
    },
    formatPrice: (state, getters) => (price) => {
      if (!price || price === 0) return 'Free';
      const converted = getters.convertPrice(price);
      return `${getters.currencySymbol}${converted}`;
    }
  },

  modules: {
    orders,
    address,
    products,
    reviews,
    auth,
    cart,
    revenue,
    events
  },


  // plugins: [createPersistedState()]
});
