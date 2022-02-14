import Vue from 'vue'
import router from './router/'
import store from './store/'
import './registerServiceWorker'
import './plugins/vuetify'
import './theme/default.sass'
import '@/assets/images/main.scss'

import App from './App.vue'
import vuetify from './plugins/vuetify'
import '@/plugins/components'
import i18n from './plugins/i18n'
import '@mdi/font/css/materialdesignicons.css'
import 'jodit/build/jodit.css'
import ApiService from './common/api.service'
import Vuelidate from 'vuelidate'
// import VueSocketIO from 'vue-socket.io'

// Vue.use(
//   new VueSocketIO({
//     debug: true,
//     connection: 'https://printhub.vnstore.xyz/api/printhub/publisher',
//     vuex: {
//       store,
//       actionPrefix: 'socket_',
//       mutationPrefix: 'SOCKET_',
//     },
//     options: {
//       extraHeaders: {
//         'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjbGllbnRJZCI6IjYwNTdmOTEzODhhY2E3N2JhZGFhOGJiNCIsInRva2VuSWQiOiI2MTZjZGVlN2E2MDAwNzFmMjllNzRhMGEiLCJpYXQiOjE2MzQ1MjQ5MDMsImV4cCI6MTYzNDYxMTMwM30.hVv2-D3n1jD0S1UCxdrAfL14qj_DOdSO62NA3__8OJ8',
//         'x-access-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjbGllbnRJZCI6IjYwNTdmOTEzODhhY2E3N2JhZGFhOGJiNCIsInRva2VuSWQiOiI2MTZjZGVlN2E2MDAwNzFmMjllNzRhMGEiLCJpYXQiOjE2MzQ1MjQ5MDMsImV4cCI6MTYzNDYxMTMwM30.hVv2-D3n1jD0S1UCxdrAfL14qj_DOdSO62NA3__8OJ8',
//       },
//     },
//   }),
// )

ApiService.init()
Vue.use(Vuelidate)
Vue.config.productionTip = false

const app = new Vue({
  router,
  store,
  i18n,
  vuetify,
  render: h => h(App),
})
app.$mount('#app')
