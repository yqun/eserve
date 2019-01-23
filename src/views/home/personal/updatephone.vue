<template>
  <div class="content">
    <group>
      <x-input title="　新手机:"
               type="number"
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
    <x-button :gradients="btncolor" class="btn">保存</x-button>
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
    }
  }
}
</script>

<style scoped>
.btn {
  margin-top: 30px;
}
</style>
