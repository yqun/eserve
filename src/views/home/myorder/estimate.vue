<template>
  <div class="fixedpadding">
    <x-header style="background-color:dodgerblue;color:#fff;">
      <span>工单提交</span>
      <x-icon slot="overwrite-left"
              type="ios-arrow-left"
              size="30"
              @click="$router.push($router.path)"
              style="fill:#fff;position:relative;top:-5px;left:-3px;"></x-icon>
    </x-header>
    <checker v-model="radio"
             class="radio"
             default-item-class="radio-item"
             selected-item-class="radio-item-selected">
      <div><checker-item :value="1"></checker-item>满意</div>
      <div><checker-item :value="2"></checker-item>不满意</div>
      <div><checker-item :value="3"></checker-item>很不满意</div>
    </checker>
    <group title="附言">
      <x-textarea :max="200"
                  v-model="textareaval"
                  placeholder="附言"
                  :show-counter="false"
                  :rows="5" :cols="30">
      </x-textarea>
    </group>
    <x-button :gradients="btncolor" class="btn" @click.native="submitBtn()">提交</x-button>
  </div>
</template>

<script>
export default {
  name: "estimate",
  data() {
    return {
      radio: 1,
      textareaval: '',
      btncolor: ['dodgerblue', 'dodgerblue'],
    }
  },
  methods: {
    // 点击提交
    submitBtn () {
      if (!this.radio) return false;
      console.log(this.radio)
      console.log(this.textareaval)
    }
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
.radio {
  margin-top: 16px;
}
.radio > div {
  display: inline-block;
  width: 32%;
  text-align: center;
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
.btn {
  position: fixed;
  bottom: 0;
  border-radius: 0px;
}
</style>
