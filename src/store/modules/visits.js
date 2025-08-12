import axiosInstance from "../../helpers/axiosInstance";
const state = {
    visits: [],
};
const mutations = {

    SET_VISITS(state, visits) {
        state.visits = visits;
    },
};
const actions = {

    fetchVisits({
        commit
    }) {
        return axiosInstance
            .get('/vit')
            .then((response) => {
                commit('SET_VISITS', response.data.visits);
            })
            .catch((error) => {
                console.error(error);
            });
    },
};
const getters = {


    getVisits(state) {
        return state.visits;
    },
};


export default {

    state,
    mutations,
    actions,
    getters
}