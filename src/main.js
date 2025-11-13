import { createApp } from 'vue'
import App from './App.vue'

import router from './router'
import store from './store'
import Notifications from '@kyvg/vue3-notification'
import { QuillEditor } from 'vue3-quill'
//import vue3GoogleLogin from 'vue3-google-login'
import VueSweetalert2 from "vue-sweetalert2"
import VueGtag from 'vue-gtag'

// ✅ Import CSS
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import "leaflet/dist/leaflet.css"
import 'owl.carousel/dist/assets/owl.carousel.css'
import 'owl.carousel'

// ✅ Import vue-meta
import { createMetaManager } from 'vue-meta'

// ✅ Optional: Initialize auth
await store.dispatch("initAuth")
store.commit('loadCartFromStorage') // Load cart data from localStorage

// ✅ Create app instance
const app = createApp(App)

// ✅ Use plugins
app.use(router)
app.use(store)
app.use(Notifications)
app.use(VueSweetalert2)
app.use(VueGtag, { config: { id: 'G-K79WK6WBGH' } })

app.component('QuillEditor', QuillEditor)

// ✅ Add vue-meta
app.use(createMetaManager())

// ✅ Mount app
app.mount('#app')
