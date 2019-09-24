import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    navIndex: 0, // 导航的索引

    serviceId: 0, // 我的工单，选择的服务单位
    orderId: { // 点开的工单id(列表跳转到详情页面使用)
      type: Number,
      default: 0,
    },

    salesmanBackRouter:'', // 跳转到选择业务员和客户之前的地址
  },
  mutations: {
    changeNavIndex: (state, index) => state.navIndex = index,

    changeServiceId: (state, id) => state.serviceId = id,
    changeOrderId: (state, id) => state.orderId = id,

    changeSalesmanBackRouter(state, data) {
      state.salesmanBackRouter = data
    },
  }
})

export default store;
