import Vue from "vue";
import App from "./App.vue";
import store from "./store";
import Echarts from "vue-echarts";
import "echarts/lib/chart/bar";
import "echarts/lib/component/title";
import "echarts/lib/chart/line";
import BootstrapVue from "bootstrap-vue";
import router from "./router";
import FunctionalCalendar from "vue-functional-calendar";
import VueClipboard from 'vue-clipboard2';
import '@fortawesome/fontawesome-free/css/all.css'
import '@fortawesome/fontawesome-free/js/all.js'

Vue.config.productionTip = false;

Vue.component("chart", Echarts);

Vue.use(FunctionalCalendar, {
  dayNames: ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"]
});
Vue.use(BootstrapVue);

Vue.use(VueClipboard);
new Vue({
  el: "#app",
  router,
  store,
  render: h => h(App)
});
