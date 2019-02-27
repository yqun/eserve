<template>
  <div class="content">
    <h2>Welcome</h2>
    <input type="text" placeholder="手机号" v-model="useriphone">
    <input type="password" placeholder="密码" v-model="userpwd">
    <div style="text-align: left; margin-top: 10px;">
      <check-icon :value.sync="username"  type="plain">记住用户名</check-icon>
    </div>
    <x-button :gradients="['#8acffe', '#2A91D8']" @click.native="login()">登录</x-button>
    <div class="footer">北京金山顶尖科技股份有限公司</div>
  </div>
</template>

<script>
import { CheckIcon } from 'vux'
export default {
  name: "login",
  components: {
    CheckIcon
  },
  data() {
    return {
      useriphone: '',
      userpwd: '',
      username: false,
    }
  },
  methods: {
    login() {
      this.$router.push('/internalorder')
    }
  }
}
</script>

<style scoped>
html, body, #app {
  height: 100%;
}
.content {
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  background: -webkit-linear-gradient(left, #2A91D8 , #8acffe); /* Safari 5.1 - 6.0 */
  background: -o-linear-gradient(right, #2A91D8, #8acffe); /* Opera 11.1 - 12.0 */
  background: -moz-linear-gradient(right, #2A91D8, #8acffe); /* Firefox 3.6 - 15 */
  background: linear-gradient(to right, #2A91D8 , #8acffe); /* 标准的语法 */
  text-align: center;
  padding: 100px 20px 0;
}
h2 {
  font-size: 40px;
  color: #fff;
}
input {
  width: 100%;
  display: block;
  box-sizing: border-box;
  height: 40px;
  outline: none;
  border: 1px solid #fff;
  background-color: transparent;
  margin-top: 20px;
  padding: 0 10px;
  border-radius: 14px;
  color: #fff;
}
button {
  margin-top: 80px;
}
.footer {
  margin-top: 100px;
  color: #fff;
}
</style>
