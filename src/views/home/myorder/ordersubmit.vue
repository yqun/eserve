<template>
  <div class="fixedpadding">
    <x-header style="background-color:dodgerblue;color:#fff;">
      <span>工单提交</span>
      <x-icon slot="overwrite-left"
              type="ios-arrow-left"
              size="30"
              @click="routerLink()"
              style="fill:#fff;position:relative;top:-5px;left:-3px;"></x-icon>
    </x-header>
    <group>
      <selector title="资产类别"
                direction="rtl"
                :options="assets"
                v-model="assestvalue"
                placeholder="请选择资产类别">
      </selector>
      <selector title="服务单位"
                direction="rtl"
                :options="service"
                v-model="servicevalue"
                placeholder="请选择单位">
      </selector>
    </group>
    <group>
      <x-textarea :max="100"
                  v-model="questvalue"
                  placeholder="问题描述">
      </x-textarea>
    </group>
    <group>
      <uploader
        ref="input"
        :max="10"
        :show-header="true"
        :handle-click="false"
        :autoUpload="false"
        name="img"
        size="small"
        :images="images"
        :uploadUrl="uploadUrl"
        @preview="previewMethod"
        @upload-image="getImages"
      ></uploader>
    </group>
    <group>
      <div style="float: left; width: 70%">
        <x-textarea placeholder="服务地址" v-model="addressvalue" :rows="2" :cols="10"></x-textarea>
      </div>
      <div style="float: left; width: 30%">
        <x-button :gradients="btncolor" style="margin-top: 13px;" link="/oftenaddress">常用地址</x-button>
      </div>
    </group>
    <group style="margin-bottom: 42px;">
      <x-textarea placeholder="备注" v-model="remarksvalue" :rows="2" :cols="10"></x-textarea>
    </group>
    <x-button :gradients="btncolor" class="btnsubmit">提交</x-button>
  </div>
</template>

<script>
import Uploader from 'vux-uploader'
export default {
  components: {
      Uploader,
  },
  name: "ordersubmit",
  data() {
    return {
      assestvalue: null,
      assets: [{key:1, value:'自有产品'},{key:2, value:'进口产品'}],
      servicevalue: null,
      service: [{key:1, value:'金山顶尖'},{key:2, value:'进口产品'}],
      questvalue: '',
      btncolor: ['dodgerblue', 'dodgerblue'],
      addressvalue: '',
      remarksvalue: '',
      // 图片上传配置
      images: [],
      uploadUrl: '',
    }
  },
  created() {

  },
  methods: {
    routerLink() {
      this.$router.path == '/oftenaddress'? this.$router.push('/myorder'):this.$router.push(this.$router.path)
    },
    previewMethod(formData) {
      console.log('previewMethod')
      console.log(formData)
    },
    getImages(formData) {
      console.log('getImages')
      console.log(formData)
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
.btnsubmit {
  position: fixed;
  bottom: 0;
  border-radius: 0;
}
</style>
