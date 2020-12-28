import Vue from "vue";
import Vuex, { StoreOptions } from "vuex";
import { RootState } from "./types";
import { contact } from "../components/contact";

Vue.use(Vuex);

const store: StoreOptions<RootState> = {
  state: {
    // progress bar
    loading: false
  },
  mutations: {
    // progress bar
    showLoading(state) {
      state.loading = true;
    },
    clearLoading(state) {
      setTimeout(() => {
        state.loading = false;
      }, 500);
    }
  },
  actions: {},
  modules: {
    contact
  }
};

//export default new Vuex.Store({});
export default new Vuex.Store<RootState>(store);
