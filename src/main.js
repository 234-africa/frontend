import { createApp } from 'vue'
import App from './App.vue'

import { createHead } from '@vueuse/head'
import router from './router'
import store from './store'
import Notifications from '@kyvg/vue3-notification'

import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js' // includes Popper.js

import { QuillEditor } from 'vue3-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import 'leaflet/dist/leaflet.css'
import 'owl.carousel/dist/assets/owl.carousel.css'
import 'owl.carousel'

import $ from 'jquery'
import VueGtag from 'vue-gtag'
import vue3GoogleLogin from 'vue3-google-login'
import VueSweetalert2 from 'vue-sweetalert2'

// Optional: top-level await (if supported)
// await store.dispatch("initAuth");
store.dispatch("initAuth").then(() => {
  store.commit('loadCartFromStorage') // Load cart data from localStorage

  const app = createApp(App)

  // Create head manager for meta tags
  const head = createHead()

  app
    .use(store)
    .use(router)
    .use(head)
    .use(Notifications)
    .use(VueSweetalert2)
    .use(VueGtag, {
      config: { id: 'G-K79WK6WBGH' }
    }, router)
    .use(vue3GoogleLogin, {
      clientId: 'YOUR_GOOGLE_CLIENT_ID' // Replace with actual client ID
    })

  // Register global component
  app.component('QuillEditor', QuillEditor)

  app.mount('#app')
})
