import Vue from "vue";
import Router from "vue-router";

// Containers
const Dashboard = () => import("@/views/Dashboard");

Vue.use(Router);

// const header = {
//   dashboard: 1,
//   listing: 1,
//   new: 1,
//   edit: 1,
//   masterSetting: 1
// };

const router = new Router({
  mode: "hash", // https://router.vuejs.org/api/#mode
  linkActiveClass: "open active",
  routes: [
    {
      path: "/",
      name: "Dashboard",
      component: Dashboard,
      meta: {
        title: "Dashboard - AKAMI"
      }
    }
  ]
});

// const DEFAULT_TITLE = "Home";
router.beforeEach((to, from, next) => {
  document.title = to.meta.title;
  next();
});
export default router;
