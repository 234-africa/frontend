import {
    createApp
} from 'vue'
import App from './App.vue'
import VueApexCharts from "vue3-apexcharts";
import router from './router'
import store from './store'
import Notifications from '@kyvg/vue3-notification'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; // includes popper.js

import { QuillEditor } from 'vue3-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css';
import "leaflet/dist/leaflet.css";


import vue3GoogleLogin from 'vue3-google-login'




store.commit('loadCartFromStorage'); // Load cart data from localStorage

import VueSweetalert2 from "vue-sweetalert2";


createApp(App).use(store,'apexchart', 'QuillEditor', QuillEditor, Notifications,VueSweetalert2, VueApexCharts,vue3GoogleLogin, {
     }).use(router).mount('#app')