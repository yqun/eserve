import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    navIndex: 0, // 导航的索引

    salesmanBackRouter:'',
  },
  mutations: {
    changeSalesmanBackRouter(state, data) {
      state.salesmanBackRouter = data
    },
    increment (state, index) {
      state.navIndex = index
    }
  }
})

export default store;
