<template>
  <div class="fixedpadding">
    <x-header style="background-color:dodgerblue;color:#fff;">
      <span>工单详情</span>
      <x-icon slot="overwrite-left"
              type="ios-arrow-left"
              size="30"
              @click="$router.push({path: '/performorderinfo', query: {index: index, id: orderId}})"
              style="fill:#fff;position:relative;top:-5px;left:-3px;"></x-icon>
    </x-header>
    <group>
      <!-- 预计完成时间 -->
      <datetime
        v-model="finishDate"
        title="预计完成时间">
      </datetime>
    </group>
    <group>
      <!-- 工作内容 -->
      <x-textarea :max="20"
                  placeholder="工作内容">
      </x-textarea>
    </group>
    <group>
      <!-- 工时 -->
      <x-input title="工时(小时)" :show-clear="false" v-model="workDate"></x-input>
    </group>
    <group>
      <x-input title="交通费用(元)" placeholder="交通费用(元)" :show-clear="false" v-model="transportationCost"></x-input>
      <x-input title="行驶里程(公里)" placeholder="行驶里程(公里)" :show-clear="false" v-model="mileage"></x-input>
    </group>
    <group title="工单已完成">
      <checker v-model="radio"
               class="radio"
               default-item-class="radio-item"
               selected-item-class="radio-item-selected">
        <div><checker-item value="未完成"></checker-item>未完成</div>
        <div><checker-item value="已完成"></checker-item>已完成</div>
      </checker>
      <!-- 备注 -->
      <x-textarea :max="200"
                  v-model="textareaval"
                  placeholder="备注"
                  :show-counter="false"
                  :rows="5" :cols="30">
      </x-textarea>
    </group>
    <x-button :gradients="btncolor"
              class="btnsubmit"
              @click.native="$router.push({path:'/performorderinfo', query: {id: orderId, index: index}})">
      提交
    </x-button>
  </div>
</template>

<script>
export default {
  name: "writeworkcontent",
  data() {
    return {
      index: 0,
      orderId: 0,
      btncolor: ['dodgerblue', 'dodgerblue'],
      finishDate: '',
      workDate: 0,
      transportationCost: '',
      mileage: '',
      radio: '未完成',
      textareaval: '',
    }
  },
  created() {
    this.getquery()
  },
  methods: {
    // 获取参数
    getquery() {
      this.index = this.$route.query.index
      this.orderId = this.$route.query.id
    },
  }
}
</script>

<style scoped>
.vux-header {
  position:fixed;
  top: 0;
  z-index: 999;
  width: 100%;
}
.btnsubmit {
  width: 100%;
  position: fixed;
  bottom: 0;
  z-index:999;
  border-radius: 0px;
}
.radio {
  margin-top: 16px;
}
.radio > div {
  display: inline-block;
  width: 32%;
  text-align: center;
  margin-bottom: 10px;
}
.radio-item {
  width: 18px;
  height: 18px;
  border: 3px solid #ccc;
  display: inline-block;
  border-radius: 50%;
  line-height: 20px;
  text-align: center;
  vertical-align: bottom;
  margin-right: 4px;
}
.radio-item-selected {
  border-color: green;
  position: relative;
}
.radio-item-selected::after {
  content: '';
  display: block;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: green;
  position: absolute;
  left: 6px;
  top: 6px;
}
</style>
