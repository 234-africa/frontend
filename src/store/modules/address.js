// address.js

import axios from "axios";
import axiosInstance from "@/helpers/axiosInstance";

const state = {
  contactInfo: {},
};

const mutations = {
  setContactInfo(state, contact) {
    state.contactInfo = contact;
  },
};

const actions = {
   setContactInfo({ commit }, contact) {
    commit("setContactInfo", contact);
  }
};

const getters = {
  getContactInfo(state) {
    return state.contactInfo;
  }
};

export default {
  //   namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
