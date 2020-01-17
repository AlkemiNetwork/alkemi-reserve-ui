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

Vue.config.productionTip = false;

Vue.component("chart", Echarts);

Vue.use(FunctionalCalendar, {
  dayNames: ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"]
});
Vue.use(BootstrapVue);
new Vue({
  el: "#app",
  router,
  store,
  render: h => h(App)
});
