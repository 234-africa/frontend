import axiosInstance from "../../helpers/axiosInstance";

const state = {
  revenues: [],
  totalIncome: 0,
  totalExpenses: 0,
};

const mutations = {
  SET_REVENUES(state, revenues) {
    state.revenues = revenues;
  },
  SET_TOTAL_INCOME(state, totalIncome) {
    state.totalIncome = totalIncome;
  },
  SET_TOTAL_EXPENSES(state, totalExpenses) {
    state.totalExpenses = totalExpenses;
  },
};

const actions = {
  fetchRevenues({ commit }) {
    return axiosInstance
      .get('/revenue')
      .then((response) => {
        commit('SET_REVENUES', response.data.revenues);
        commit('SET_TOTAL_INCOME', calculateTotalIncome(response.data.revenues));
        commit('SET_TOTAL_EXPENSES', calculateTotalExpenses(response.data.revenues));
      })
      .catch((error) => {
        console.error(error);
      });
  },
};

const getters = {
  getRevenues(state) {
    return state.revenues;
  },
  getTotalIncome(state) {
    return state.totalIncome;
  },
  getTotalExpenses(state) {
    return state.totalExpenses;
  },
};

// Helper function to calculate the total income
function calculateTotalIncome(revenues) {
  let totalIncome = 0;
  revenues.forEach(revenue => {
    totalIncome += revenue.income;
  });
  return totalIncome;
}

// Helper function to calculate the total expenses
function calculateTotalExpenses(revenues) {
  let totalExpenses = 0;
  revenues.forEach(revenue => {
    totalExpenses += revenue.expenses;
  });
  return totalExpenses;
}

export default {
  state,
  mutations,
  actions,
  getters
};
