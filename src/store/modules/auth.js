// store/index.js



import axiosInstance from "../../helpers/axiosInstance";
import Swal from "sweetalert2";
import router from '@/router';

const state = {
  users: [],
  user: null,
  error: null,
  userDetails: null,
  token: null,
};
const mutations = {
  SET_TOKEN(state, token) {
    state.token = token;
  },
  SET_USER_DETAILS(state, userDetails) {
    state.userDetails = userDetails;
  },
  SET_USERS(state, users) {
    state.users = users
  },
  setUser(state, user) {
    state.user = user;
  },
  setError(state, error) {
    state.error = error;
  },
};
const actions = {
  setToken({ commit }, token) {
    commit("setToken", token);
  },
  getTokenFromStorage({ commit }) {
    const token = localStorage.getItem("token");
    commit("SET_TOKEN", token);
  },
  REGISTER_USER({
    commit
  }, payload) {
    return new Promise((resolve, reject) => {
      axiosInstance.post("/auth/signup", payload)
        .then(res => {
          if (res.data.success == true) {
            resolve(res.data)
          }
        })
        .catch(err => {
          reject(err.response.data)
        })
    })
  },
  LOGIN_USER({
    commit
  }, payload) {
    return new Promise((resolve, reject) => {
      axiosInstance.post("/auth/login", payload)
        .then(res => {
          if (res.data.success == true) {
            const token = res.data.token;
            localStorage.setItem("token", token);
            resolve(res.data);
          } else {
            reject(res.data);
          }
        })
        .catch(err => {
          reject(err.response.data);
        });
    });
  },


  logout({
    commit
  }) {
    return new Promise((resolve, reject) => {
      commit("logout");
      localStorage.removeItem("token");
      delete axiosInstance.defaults.headers.common["Authorization"];
      resolve();
      window.location.href = '/login'; // Redirect to the login page
    });
  },
  async sendCodeToBackend({ commit }, code) {
    try {
      const headers = {
        Authorization: code,
      };
      console.log('Authorization header:', headers.Authorization);

      const response = await axiosInstance.post('https://event-ticket-qa70.onrender.com/api/auth/google', null, { headers });
      const userDetails = response.data;

      commit('SET_USER_DETAILS', userDetails);

      localStorage.setItem('token', response.data.token);
      Swal.fire("login successful");
      window.location.href = '/dash';

        } catch (error) {
      console.error('Failed to send authorization code:', error);
    }


  },

  fetchUsers({
    commit
  }) {
    return axiosInstance
      .get('/users')
      .then((response) => {
        // console.log(response)
        commit('SET_USERS', response.data.users);
        return dispatch('fetchAddressesForUsers', users);

      })
      .catch((error) => {
        console.error(error);
      });
  },
  getUser({ commit }) {
    const token = localStorage.getItem('token');
    if (!token) {
      commit('setError', 'No token available');
      return Promise.reject('No token available');
    }

    return axiosInstance
      .get('/auth/user', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        const user = response.data.user;
        user.isAdmin = user.isAdmin === true; // Assuming the isAdmin property is already a boolean
        commit('setUser', user);
        return user;
      })
      .catch((error) => {
        commit('setError', error.response.data.message);
        return Promise.reject(error.response.data.message);
      });
  },



  setToken({ commit }, token) {
    commit('SET_TOKEN', token);
  },

};
const getters = {
  getToken(state) {
    return state.token;
  },
  isAdmin: state => state.user && state.user.isAdmin,


  totalUserPercent(state) {
    const totalUsers = state.users.length;
    //console.log(totalUsers)
    return ((totalUsers / 100));

  },

  getUsers: (state) => {
    return state.users;
  },
  getUser(state) {
    return state.user;
  },

  currentUser(state) {
    return state.user;
  },
  error(state) {
    return state.error;
  },



};


export default {

  state,
  mutations,
  actions,
  getters
}