import axiosInstance from "../../helpers/axiosInstance";
const state = {
    products: [],
    product: [],
    sortedProducts: [],
    likedProducts: [],
    highestSellingProduct: null,
    productsByUser: [],


};
const mutations = {
    SET_HIGHEST_SELLING_PRODUCT(state, products) {
        state.highestSellingProduct = products;
    },
    SET_PRODUCTS_BY_USER(state, products) {
        state.productsByUser = products;
    },
    SET_PRODUCTS(state, products) {
        state.products = products;
    },
    SET_PRODUCT(state, product) {
        state.product = product;
    },
    SET_SORTED_PRODUCTS(state, sortedProducts) {
        state.sortedProducts = sortedProducts;
    },
    SET_LIKED_PRODUCTS(state, likedProducts) {
        state.likedProducts = likedProducts;
    },
    INCREMENT_LIKES(state) {
        if (state.products) {
            state.products.likes++;
        }
    },

};
const actions = {
    async createProduct({ commit }, formData) {
        try {
          const response = await axiosInstance.post('/products', formData);
          // Handle successful response if needed
          return response.data;
        } catch (error) {
          // Handle error if needed
          throw error;
        }
      },
    fetchHighestSellingProducts({
        commit
    }) {
        return axiosInstance
            .get('/highest-selling-product')
            .then((response) => {
                const products = response.data.highestSellingProducts;
                commit('SET_HIGHEST_SELLING_PRODUCT', products);
            })
            .catch((error) => {
                console.error(error);
            });
    },

    fetchProducts({
        commit
    }) {
        return axiosInstance
            .get('/products')
            .then((response) => {
                commit('SET_PRODUCTS', response.data.products);

            })
            .catch((error) => {
                console.error(error);
            });
    },
     fetchProductsByUser({
        commit
    }) {
        return axiosInstance
            .get('/user/products')
            .then((response) => {
                commit('SET_PRODUCTS_BY_USER', response.data.products);
            })
            .catch((error) => {
                console.error(error);
            });
    },
    fetchSortedProducts({
        commit
    }) {
        return axiosInstance
            .get("/products")
            .then((response) => {
                const products = response.data.products;
                const sortedProducts = products.sort((a, b) => b.views - a.views);

                commit("SET_SORTED_PRODUCTS", sortedProducts);
            })
            .catch((error) => {
                console.log(error);
            });
    },
    fetchLikedProducts({
        commit
    }) {
        return axiosInstance
            .get("/products")
            .then((response) => {
                const products = response.data.products;
                const likedProducts = products.sort((a, b) => b.likes - a.likes);

                commit("SET_LIKED_PRODUCTS", likedProducts);
            })
            .catch((error) => {
                console.log(error);
            });
    },


    likeProducts({
        commit
    }, productId) {
        return axiosInstance
            .post(`/products/${productId}/like`)
            .then(response => {
            //    console.log(response)
               commit('INCREMENT_LIKES');
               const products = response.data.likes;
                // Handle the response if needed
            })
            .catch(error => {
                console.error(error);
            });
    },

    incrementViews({
        commit
    }, productId) {
        return axiosInstance
            .post(`/products/${productId}/views`)
            .then(response => {
                // Handle the response if needed
            })
            .catch(error => {
                console.error(error);
            });
    },
    fetchProduct({
        commit
    }, productId) {
        return axiosInstance
            .get(`/products/${productId}`)
            .then(response => {
                commit("SET_PRODUCT", response.data.product);
                history.replaceState({}, "", response.data.product.title.replaceAll(" ", "-"));

            })
            .catch(error => {
                console.error(error);
            });
    }
};
const getters = {
    totalPercentage(state) {
        const totalProducts = state.products.length;
        // console.log(state.products.products.length)
        return ((totalProducts / 100));
        //return ((totalProducts / 100) ).toFixed(0);
    },
    getProductsByUser(state) {
        return state.productsByUser;
    },
    getHighestSellingProducts(state) {
        return state.highestSellingProduct;
    },
    getProduct(state) {
        return state.product;
    },

    getProducts(state) {
        return state.products;
    },
    getSortedProducts(state) {
        return state.sortedProducts;
    },
    getLikedProducts(state) {
        return state.likedProducts;
    },
    sortedProductsWithHighestSelling(state, getters) {
        const sortedProducts = getters.getSortedProducts;
        const highestSellingProducts = getters.getHighestSellingProducts;

        // Merge the sorted products and highest-selling products
        const mergedProducts = sortedProducts.map((product) => {
          const highestSellingProduct = highestSellingProducts.find(
            (item) => item.productID === product._id
          );

          return {
            ...product,
            sales: highestSellingProduct ? highestSellingProduct.sales : 0
          };
        });

        return mergedProducts;
      }


};



export default {

    state,
    mutations,
    actions,
    getters
}