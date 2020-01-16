import Vuex from "vuex";
import Vue from "vue";
import VuexPersist from "vuex-persist";
import controller from "../_Controller";

Vue.use(Vuex);

const vuexLocalStorage = new VuexPersist({
  key: 'vuex',
  storage: window.localStorage,
  reducer: state => ({
    alkemiNetwork: state.alkemiNetwork
  })
})

export default new Vuex.Store({
  plugins: [vuexLocalStorage.plugin],
  modules: {
    controller
  }
});
