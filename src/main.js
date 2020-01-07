import Vue from "vue";
import App from "./App.vue";

Vue.config.productionTip = false;
import BootstrapVue from 'bootstrap-vue'
import router from './router'
// new Vue({
//   render: h => h(App)
// }).$mount("#app");

Vue.use(BootstrapVue)
new Vue({ el: '#app', router, render: h => h(App) })

/* eslint-disable no-new */
// new Vue({
//   el: '#app',
//   router,
//   template: '<App/>',
//   components: {
//     App
//   },
// });
