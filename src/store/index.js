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
import visit from './modules/visits'
import reviews from './modules/reviews'
import address from './modules/address'



// Vue.use(Vuex);


export default createStore({
  plugins: [createPersistedState()],

  modules: {
    orders,
    address,
    products,
    reviews,
    auth,
    cart,
    revenue,
    visit
  },


  // plugins: [createPersistedState()]
});