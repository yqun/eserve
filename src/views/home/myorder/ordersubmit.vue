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
                v-model="assetskey"
                placeholder="请选择资产类别">
      </selector>
      <selector title="服务单位"
                direction="rtl"
                :options="service"
                v-model="servicekey"
                placeholder="请选择单位">
      </selector>
    </group>

    <p class="person" v-for="item in serviceStaffers" :key="item.id">{{item.f_name}} {{item.f_phone_num}}</p>
    <group>
      <x-textarea :max="100"
                  v-model="questvalue"
                  placeholder="问题描述">
      </x-textarea>
    </group>
    <wx-voice @voiceStr="getVoiceStr"></wx-voice>
    <!-- 上传图片 -->
    <group>
      <!-- 查看图片 -->
      <div v-transfer-dom>
        <previewer :list="filesImg"
                   ref="previewer"
                   :options="options">
        </previewer>
      </div>
      <!-- vux-uploader 图片上传 -->
      <uploader
        :max="5"
        :handle-click="false"
        :autoUpload="true"
        :show-header="true"
        :upload-url="uploadUrl"
        name="file"
        :images="images"
        size="small"
        :previmg="filesImg"
        @preview="show"
      ></uploader>
    </group>
    <group>
      <div style="float: left; width: 65%">
        <x-textarea placeholder="服务地址" v-model="addressvalue" :rows="2" :cols="10"></x-textarea>
      </div>
      <div style="float: left; width: 35%">
        <x-button :gradients="btncolor" style="margin-top: 13px;" link="/oftenaddress">常用地址</x-button>
      </div>
    </group>
    <group style="margin-bottom: 42px;">
      <x-textarea placeholder="备注" v-model="remarksvalue" :rows="2" :cols="10"></x-textarea>
    </group>
    <x-button :gradients="btncolor" class="btnsubmit" @click.native="orderinfo()">提交</x-button>
    <!-- toast -->
    <toast v-model="toastShow"
           :text="toastValue"
           type="text" :time="800"
           is-show-mask
           position="middle" width="10em"></toast>
  </div>
</template>

<script>
// import Uploader from 'vux-uploader'
import Uploader from '../../../components/vux-uploader/src/main'
import { TransferDom } from 'vux'
import bus from '@/eventbus/eventbus'
import wxVoice from '../../../components/wxVoice'
export default {
  components: {
    Uploader,
    wxVoice
  },
  directives: {
    TransferDom
  },
  name: "ordersubmit",
  data() {
    return {
      assetskey: null,
      assets: [],
      servicekey: null,
      service: [],
      serviceStaffers: [], // 公司负责人数组
      questvalue: '',
      btncolor: ['dodgerblue', 'dodgerblue'],
      addressvalue: '',
      remarksvalue: '',
      // 图片上传配置
      options: {
        getThumbBoundsFn (index) {
          let thumbnail = document.querySelectorAll('.previewer-demo-img')[index]
          let pageYScroll = window.pageYOffset || document.documentElement.scrollTop
          let rect = thumbnail.getBoundingClientRect()
          return {x: rect.left, y: rect.top + pageYScroll, w: rect.width}
        }
      },
      toastShow: false,
      toastValue: '',
      /* vux-uploader */
      images: [],
      filesId: [],
      filesImg: [],
    }
  },
  watch: {
    assetskey(newVal, oldVal) {
      if (newVal == oldVal) return false;
      this.getservice()
    },
    servicekey(newVal, oldVal) {
      if (newVal == oldVal) return false;
      this.service.forEach(item => {
        if (item.key == newVal) {
          this.serviceStaffers = item.serviceStaffers
        }
      })
    },
  },
  computed: {
    uploadUrl() {
      return `${this.axiosUrl}system/uploadFile.do?token=${this.token}`
    }
  },
  created() {
    this.token = window.sessionStorage.getItem('token')
    this.getassets()
  },
  activated () {
    bus.$on('sendAddress', address => {
      this.addressvalue = address
    })
  },
  methods: {
    routerLink() {
      this.$router.path == '/oftenaddress'? this.$router.replace('/myorder'):this.$router.replace(this.$router.path)
    },
    show (index) {
      console.log(this.filesImg)
      this.$refs.previewer.show(index)
    },
    // 获取资产类别
    getassets() {
      this.axios
        .get('equmentType/findEntityByPage.do')
        .then(res => {
          // console.log(res)
          const {rows} = res.data
          if (!rows.length) return false;
          rows.forEach(item => {
            this.assets.push({
              key:item.id,
              value:item.f_name,
              f_unit_id: item.f_unit_id
            })
          })
        })
    },
    // 获取服务单位
    getservice() {
      this.service.length = 0;
      this.servicekey = null;
      this.axios
        .get(`equmentType/findSuppliesByEqumentType.do?id=${this.assetskey}`)
        .then(res => {
          // console.log(res)
          const {rows} = res.data
          if (!rows.length) return false;
          rows.forEach(item => {
            this.service.push({
              key:item.id,
              value:item.f_name,
              serviceStaffers: item.serviceStaffers
            })
          })
          if (this.service.length == 1) {
            this.servicekey = this.service[0].key
          }
        })
    },
    // 点击提交按钮
    orderinfo() {
      // service
      // assets
      let servicevalue,assetsvalue;
      this.assets.forEach(item => {
        if (this.assetskey == item.key) return assetsvalue = item.value
      })
      this.service.forEach(item => {
        if (this.servicekey == item.key) return servicevalue = item.value
      })
      // 获取图片id
      this.images.forEach(item => {
        console.log(item)
        this.filesId.push(item.id)
      })
      const data = {
        ids: this.filesId,
        f_equmentType_id: this.assetskey,
        f_equmentType_name: assetsvalue,
        f_handler_org_id: this.servicekey,
        f_handler_org_name: servicevalue,
        f_description: this.questvalue,
        f_address: this.addressvalue,
        f_remark: this.remarksvalue,
      }
      if (!this.questvalue || !this.assetskey || !this.servicekey) {
        this.toastShow = true
        this.toastValue = '请填写完整的信息'
      } else {
        this.axios
          .post('/workOrder/saveCustomerWorkOrder.do', data)
          .then(res => {
            // console.log(res)
            if(res.data.res = true) {
              this.toastShow = true
              this.toastValue = '提交完成'
              setTimeout(() => {
                this.$router.replace('/')
              }, 800)
            } else {
              const {error} = res.data
              this.toastShow = true
              this.toastValue = error
            }
          })
      }

    },
    getVoiceStr(str) {
      this.questvalue += str
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
/* 文件上传 */
li.previewpic {
  float: left;
  position: relative;
}
li.previewpic i.iconfont.icon-quancha {
  position: absolute;
  right: 4px;
  top: 0;
  color: #ccc;
}
i.iconfont.icon-tianjiatupian {
  font-size: 60px;
}
.person {
  text-align: center;
}
</style>
