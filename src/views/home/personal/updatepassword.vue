<template>
  <div class="content">
    <group>
      <x-input title="　当前密码:"
               v-model="oldPassword"
               type="password"
               :show-clear="false"
               placeholder="当前密码"
                text-align="center">
      </x-input>
      <x-input title="　　新密码:"
               v-model="newPassword"
               type="password"
               :show-clear="false"
               placeholder="新密码"
                text-align="center">
      </x-input>
      <x-input title="重复新密码:"
               v-model="againNewPassword"
               type="password"
               :show-clear="false"
               placeholder="重复新密码"
                text-align="center">
      </x-input>
    </group>
    <x-button :gradients="btncolor" class="btn" @click.native="changePaswword()">保存</x-button>
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
  name: "updatepssword",
  data() {
    return {
      btncolor: ['#2A91D8', '#2A91D8'],
      oldPassword: '',
      newPassword: '',
      againNewPassword: '',
      toastShow: false,
      toastValue: ''
    }
  },
  methods: {
    // 保存更改
    changePaswword() {
      // 判断 密码  必须填写
      if (this.oldPassword && this.newPassword && this.againNewPassword) {
        // 判断 旧密码 新密码  不相同
        if (this.oldPassword != this.newPassword) {
          // 判断 新密码 重复正确
          if (this.newPassword == this.againNewPassword) {
            // 判断条件成立 更改密码
            this.judgeOldPassword()
          } else {
            this.toastShow = true
            this.toastValue = '重复新密码不同'
          }
        } else {
          this.toastShow = true
          this.toastValue = '旧密码与新密码不能相同'
        }
      } else {
        this.toastShow = true
        this.toastValue = '请完整填写信息'
      }
    },
    // 判断旧密码是否正确
    judgeOldPassword() {
      const data = {
        pwdCu: this.oldPassword,
        newPwd: this.newPassword
      }
      this.axios
        .post('/user/updatePwd.do', data)
        .then(res => {
          // console.log(res)
          const {status} = res
          if (status == 200) {
            const state = res.data.res
            if (state == 'success') {
              // 旧密码输入正确
              // 提示信息
              this.toastShow = true
              this.toastValue = '密码修改成功'
              // 重新设置token 页面跳转
              const {token} = res.data
              window.sessionStorage.setItem('token', token)
              const _that = this
              setTimeout(function() {
                _that.$router.replace('/userinfo')
              }, 800)
            } else {
              const {error} = res.data
              this.toastShow = true
              this.toastValue = error
            }
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
