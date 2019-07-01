// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import FastClick from 'fastclick'
import router from './router/index'
import App from './App'
import FileUpload from 'vue-upload-component'
import Axios from './request/config'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

// 全局css
import './assets/css/comment.css'
import './assets/font/iconfont.css'

// 全局组件
import { Tabbar, TabbarItem } from 'vux'
import { Tab, TabItem } from 'vux'
import { XHeader } from 'vux'
import { Group } from 'vux'
import { XInput } from 'vux'
import { Datetime } from 'vux'
import { Selector } from 'vux'
import { Flexbox, FlexboxItem } from 'vux'
import { XButton } from 'vux'
import { XTextarea } from 'vux'
import { Timeline } from 'vux'
import { TimelineItem } from 'vux'
import { Previewer } from 'vux'
import { Checker, CheckerItem } from 'vux'
import { XAddress } from 'vux'
import { Scroller } from 'vux'
import { LoadMore  } from 'vux'
import { Toast } from 'vux'
import { Confirm } from 'vux'
import { Alert } from 'vux'
import  { ToastPlugin } from 'vux'


Vue.use(Axios)
Vue.use(ElementUI)
// 自定义全局组件
import NavBar from './components/navBar'

FastClick.attach(document.body)

Vue.config.productionTip = false

Vue.component('fileUpload', FileUpload)
Vue.component('navBar', NavBar)
Vue.component('tabbar', Tabbar)
Vue.component('tabbar-item', TabbarItem)
Vue.component('tab', Tab)
Vue.component('tab-item', TabItem)
Vue.component('x-header', XHeader)
Vue.component('group', Group)
Vue.component('x-input', XInput)
Vue.component('datetime', Datetime)
Vue.component('selector', Selector)
Vue.component('flexbox', Flexbox)
Vue.component('flexbox-item', FlexboxItem)
Vue.component('x-button', XButton)
Vue.component('x-textarea', XTextarea)
Vue.component('timeline', Timeline)
Vue.component('timeline-item', TimelineItem)
Vue.component('previewer', Previewer)
Vue.component('checker', Checker)
Vue.component('checker-item', CheckerItem)
Vue.component('x-address', XAddress)
Vue.component('scroller', Scroller)
Vue.component('load-more', LoadMore)
Vue.component('toast', Toast)
Vue.component('confirm', Confirm)
Vue.component('alert', Alert)
Vue.use(ToastPlugin)

// 注册一个全局自定义指令 `v-focus`
Vue.directive('focus', {
  // 当被绑定的元素插入到 DOM 中时……
  inserted: function (el) {
    // 聚焦元素
    el.focus()
  }
})


new Vue({
  el: '#app-box',
  router,
  components: { App },
  template: '<App/>'
})
