<template>
  <div>
    <tab>
      <tab-item selected @on-item-click="getIndex">{{wait || '待完成'}}</tab-item>
      <tab-item @on-item-click="getIndex">{{success || '已完成'}}</tab-item>
      <tab-item @on-item-click="getIndex">{{cancel || '已取消'}}</tab-item>
    </tab>
  </div>
</template>

<script>
export default {
  name: "navBar",
  props: ['wait', 'success', 'cancel'],
  data() {
    return {

    }
  },
  methods: {
    getIndex (index) {
      this.$emit('sendIndex', index)
    },
  }
}
</script>

<style scoped>

</style>
