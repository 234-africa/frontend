import axiosInstance from "../../helpers/axiosInstance";

const state = {
  categories: [],
  spinner: false,
  categoryID: "",
  product: {
    title: "",
    description: "",
    currency: "",
    tag: "",
    price: "",
    event: {
      startDate: "",
      endDate: "",
      startTime: "",
      timezone: "UTC",
      location: "",
    },
  },
  address: "",
  eventType: "single",
  eventFrequency: "",
  photos: [],
  previewUrl: null,
  tickets: [{ name: "", price: null, quantity: null }],
};

const getters = {
  getCategories: (state) => state.categories,
  getSpinner: (state) => state.spinner,
  getProduct: (state) => state.product,
  getTickets: (state) => state.tickets,
};

const actions = {
  async fetchCategories({ commit }) {
    try {
      const res = await axiosInstance.get("/categories");
      commit("setCategories", res.data.categories || res.data);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  },

  async submitProduct({ state, rootGetters, commit }) {
    commit("setSpinner", true);

    const formData = new FormData();
    formData.append("categoryID", state.categoryID);
    formData.append("title", state.product.title);
    formData.append("description", state.product.description);
    formData.append("tag", state.product.tag);
    formData.append("price", state.product.price);
    formData.append("currency", state.product.currency);

    formData.append("eventDate", new Date(state.product.event.startDate).toISOString());
    if (state.product.event.endDate) {
      formData.append("endDate", new Date(state.product.event.endDate).toISOString());
    }

    formData.append("startTime", state.product.event.startTime + " ");
    formData.append("timezone", state.product.event.timezone);
    formData.append("locationName", state.address);

    if (state.eventType === "recurring") {
      formData.append("eventFrequency", state.eventFrequency);
    }

    formData.append("tickets", JSON.stringify(state.tickets));
    state.photos.forEach((photo) => {
      formData.append("photos", photo);
    });

    try {
      const response = await axiosInstance.post("/products", formData, {
        headers: {
          Authorization: `Bearer ${rootGetters.getToken}`,
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Product created:", response.data);
      alert("Event created successfully!");
    } catch (error) {
      if (error.response && error.response.status === 401) {
        localStorage.removeItem("token");
        router.push("/login");
      } else {
        throw error;
      }
    }

    commit("setSpinner", false);
  },
};

const mutations = {
  setCategories(state, payload) {
    state.categories = payload;
  },
  setSpinner(state, val) {
    state.spinner = val;
  },
  setCategoryID(state, id) {
    state.categoryID = id;
  },
  updateProduct(state, payload) {
    state.product = { ...state.product, ...payload };
  },
  updateTickets(state, tickets) {
    state.tickets = tickets;
  },
  addTicket(state, ticket) {
    state.tickets.push(ticket);
  },
  removeTicket(state, index) {
    state.tickets.splice(index, 1);
  },
  duplicateTicket(state, index) {
    const ticket = state.tickets[index];
    state.tickets.splice(index + 1, 0, { ...ticket });
  },
  setPhotos(state, files) {
    state.photos = files;
  },
  setPreviewUrl(state, url) {
    state.previewUrl = url;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
