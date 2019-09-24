<template>
  <div class="fixedpadding">
    <x-header style="background-color:dodgerblue;color:#fff;">
      <span>工单提交</span>
      <x-icon slot="overwrite-left"
              type="ios-arrow-left"
              size="30"
              @click="$router.push('/myorderlistitem')"
              style="fill:#fff;position:relative;top:-5px;left:-3px;"></x-icon>
    </x-header>
    <checker v-model="radio"
             class="radio"
             default-item-class="radio-item"
             selected-item-class="radio-item-selected">
      <div><checker-item value="满意"></checker-item>满意</div>
      <div><checker-item value="不满意"></checker-item>不满意</div>
      <div><checker-item value="很不满意"></checker-item>很不满意</div>
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
  name: "estimate",
  data() {
    return {
      radio: '满意',
      textareaval: '',
      appraise: {}, //评价
      btncolor: ['dodgerblue', 'dodgerblue'],
      toastShow: false,
      toastValue: ''
    }
  },
  computed: {
    orderId() {
      return this.$store.state.orderId
    }
  },
  created() {
    this.appraise = this.$route.query.appraise
  },
  mounted() {
    this.setevaluate()
  },
  methods: {
    // 渲染页面
    setevaluate() {
      this.radio = this.appraise.f_appraise || '满意'
      this.textareaval = this.appraise.f_content || ''
    },
    // 点击提交
    submitBtn () {
      if (!this.radio) return false;
      const data = {
        f_appraise: this.radio,
        f_content: this.textareaval,
        f_work_order_id: this.orderId,
        type: 1
      }
      this.axios
        .post('appraise/saveAppraise.do', data)
        .then(res => {
          // console.log(res)
          const {status, data:{state}} = res
          if (status != 200) return false;
          if (state == 1) {
            this.toastValue = '评价成功'
            const _that = this
            setTimeout(function () {
              _that.$router.push({
                path: '/myorderlistitem',
              })
            }, 800)
          } else {
            const {error} = res.data
            this.toastValue = error
          }
          this.toastShow = true
        })
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
