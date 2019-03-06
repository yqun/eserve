<template>
  <div>
    <tab>
      <tab-item selected @on-item-click="getIndex" :selected="index == 0 || !index">{{wait || '待完成'}}</tab-item>
      <tab-item @on-item-click="getIndex" :selected="index == 1">{{success || '已完成'}}</tab-item>
      <tab-item @on-item-click="getIndex" :selected="index == 2">{{cancel || '已取消'}}</tab-item>
    </tab>
  </div>
</template>

<script>
export default {
  name: "navBar",
  props: ['wait', 'success', 'cancel', 'index'],
  data() {
    return {

    }
  },
  created() {

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
