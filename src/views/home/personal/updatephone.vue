<template>
  <div class="content">
    <group>
      <x-input title="　新手机:"
               v-model="phone"
               text-align="center"
               :show-clear="false"
               placeholder="请输入手机号">
      </x-input>
      <x-input title="当前密码:"
               type="password"
               v-model="password"
               text-align="center"
               :show-clear="false"
               placeholder="请输入密码">
      </x-input>
    </group>
    <x-button :gradients="btncolor" class="btn" @click.native="savePhone()">保存</x-button>
    <!-- toast -->
    <toast v-model="toastShow"
           :text="toastValue"
           type="text"
           :time="800"
           is-show-mask
           position="middle"
           width="10em">
    </toast>

  </div>
</template>

<script>
export default {
  name: "updatephone",
  data() {
    return {
      btncolor: ['#2A91D8', '#2A91D8'],
      phone: '',
      password: '',
      // toast
      toastShow: false,
      toastValue: ''
    }
  },
  created() {

  },
  methods: {
    savePhone() {

      if (!(/^1[34578]\d{9}$/.test(this.phone)) && !this.password) {
        this.toastShow = true
        this.toastValue = '请填写正确信息'
      } else {
      this.axios
        .post('/user/checkPhoneNum.do', {f_phone_num: this.phone})
        .then(res => {
          const state = res.data.res
          console.log(res)
          if (state == "true") {
            this.sendInfo()
          } else {
            this.toastShow = true
            this.toastValue = '电话号码已被注册，请使用其他号码'
          }
        })
      }
    },
    sendInfo() {
      const data = {
        f_phone_num: this.phone,
        f_pwd: this.password
      }
      this.axios
        .post('/user/updatePhone.do', data)
        .then(res => {
          console.log('res', res)
          const state = res.data.res
          if (state == "success") {
            const {token} = res.data
            window.sessionStorage.setItem('token', token)
            this.$router.push('/userinfo')
          } else if (state == "fail") {
            const { error } = res.data
            this.toastShow = true
            this.toastValue = error
          }
        })
    }
  }

}
</script>

<style scoped>
.btn {
  margin-top: 30px;
}
</style>
