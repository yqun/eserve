// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import FastClick from 'fastclick'
import router from './router/index'
import App from './App'
import FileUpload from 'vue-upload-component'

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


new Vue({
  el: '#app-box',
  router,
  components: { App },
  template: '<App/>'
})
