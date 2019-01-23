<template>
  <div class="content">
    <group>
      <x-input title="　当前密码:"
               v-model="oldpassword"
               type="password"
               :show-clear="false"
               placeholder="当前密码"
                text-align="center">
      </x-input>
      <x-input title="　　新密码:"
               v-model="newpassword"
               type="password"
               :show-clear="false"
               placeholder="新密码"
                text-align="center">
      </x-input>
      <x-input title="重复新密码:"
               v-model="againnewpassword"
               type="password"
               :show-clear="false"
               placeholder="重复新密码"
                text-align="center">
      </x-input>
    </group>
    <x-button :gradients="btncolor" class="btn">保存</x-button>
  </div>
</template>

<script>
export default {
  name: "updatepssword",
  data() {
    return {
      btncolor: ['#2A91D8', '#2A91D8'],
      oldpassword: '',
      newpassword: '',
      againnewpassword: '',
    }
  }
}
</script>

<style scoped>
.btn {
  margin-top: 30px;
}
</style>
