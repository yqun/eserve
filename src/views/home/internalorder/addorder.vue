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
    <group title="问题描述">
      <x-textarea placeholder="问题描述" v-model="questionvalue"></x-textarea>
    </group>
    <!-- 图片上传 -->
    <group>
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
    <!-- 客户信息 -->
    <group>
      <x-input title="客户姓名"
               :show-clear="false"
               text-align="right"
               v-model="nameinfo"
               placeholder="请输入客户姓名"
               type="text">
      </x-input>
      <x-input title="客户电话"
               :show-clear="false"
               text-align="right"
               v-model="telinfo"
               placeholder="请输入客户电话"
               type="tel">
      </x-input>
      <x-input title="客户单位"
               :show-clear="false"
               text-align="right"
               v-model="workinfo"
               placeholder="请输入客户单位">
      </x-input>
      <x-input title="设备SN号"
               :show-clear="false"
               text-align="right"
               v-model="snidinfo"
               placeholder="请输入设备SN号">
      </x-input>
      <!-- 业务员 -->
      <x-input title="业务员"
               :show-clear="false"
               v-model="usernameinfo"
               placeholder="选择业务员"
               text-align="right"
               @on-focus="$router.push({path: '/salesman', query: {userId: 1}})"></x-input>
      <selector title="所属项目"
                direction="rtl"
                :options="order"
                v-model="ordervalue"
                placeholder="请选择单位">
      </selector>
    </group>
    <!-- 服务器地址 -->
    <group>
      <div style="float: left; width: 65%">
        <x-textarea placeholder="服务地址" ref="address" v-model="addressvalue" :rows="2" :cols="10"></x-textarea>
      </div>
      <div style="float: left; width: 35%">
        <x-button :gradients="btncolor" style="margin-top: 13px;" link="/oftenaddress">常用地址</x-button>
      </div>
    </group>
    <group style="margin-bottom: 42px;">
      <x-textarea placeholder="备注" v-model="remarksvalue" :rows="2" :cols="10"></x-textarea>
    </group>
    <x-button :gradients="btncolor" class="btn" @click.native="submitBtn()">提交</x-button>
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
export default {
  name: "addorder",
  components: {
    Uploader,
  },
  directives: {
    TransferDom,
    focus: {
      // 指令的定义
      inserted: function (el) {
        el.focus()
      }
    }
  },
  data() {
    return {
      orderId: '',
      orderName: '',
      token: '',
      questionvalue: '', // 问题描述
      nameinfo: '',  // 项目基本信息
      telinfo: '', // 客户电话
      workinfo: '',  // 客户单位
      snidinfo: '', // 设备sn号
      usernameinfo: '',  // 业务员
      usernameId: '', // 业务员 姓名id
      order: [], // 所属项目
      ordervalue: '',
      // 服务器地址
      addressvalue: '',
      btncolor: ['dodgerblue', 'dodgerblue'],
      // 备注
      remarksvalue: '',
      // 图片上传
      filesImg: [],
      filesId: [],
      images: [],
      options: {
        getThumbBoundsFn(index) {
          let thumbnail = document.querySelectorAll(".previewer-demo-img")[index];

          let pageYScroll = window.pageYOffset || document.documentElement.scrollTop;

          let rect = thumbnail.getBoundingClientRect();

          return { x: rect.left, y: rect.top + pageYScroll, w: rect.width };
        }
      }, // options
      toastShow: false,
      toastValue: '',
    }
  },
  computed: {
    uploadUrl() {
      return `${this.axiosUrl}system/uploadFile.do?token=${this.token}`
    }
  },
  created() {
    this.token = window.sessionStorage.getItem('token')
    this.getporject()
  },
  activated() {
    this.getOrderData()
    this.getquery()
    bus.$on('sendAddress', address => {
      this.addressvalue = address
    })
  },
  methods: {
    // 获取提交的id和name
    getOrderData() {
      const id = this.$route.query.id
      const name = this.$route.query.name
      if (id && name) {
        window.sessionStorage.setItem('orderId', id)
        window.sessionStorage.setItem('orderName', name)
        this.orderId = id
        this.orderName = name
      } else {
        this.orderId = window.sessionStorage.getItem('orderId')
        this.orderName = window.sessionStorage.getItem('orderName')
      }
    },
    // 获取参数
    getquery() {
      const userArr = this.$route.query.user
      if (!userArr) return false;
      const jsonData = JSON.parse(userArr)
      this.usernameinfo = jsonData[0].name
      this.usernameId = jsonData[0].id
    },
    // 路由跳转
    routerLink() {
      if (this.$router.path == '/oftenaddress' || this.$router.path == '/salesman') return this.$router.push('/internalorder')
      this.$router.push(this.$router.path)
    },
    // 获取所属项目
    getporject() {
      this.axios
        .get(`project/findEntityByPage.do`)
        .then(res => {
          if (res.data.res == 1) {
            const {rows} = res.data
            rows.forEach(item => {
              this.order.push({
                key: item.id,
                value: item.f_project_name
              })
            })
          } else {
            const {error} = res.data
            this.toastShow = true
            this.toastValue = error
          }
        })
    },
    // 展示 图片
    show (index) {
      // console.log(index)
      this.$refs.previewer.show(index)
    },
    // 提交按钮
    submitBtn () {
      // 获取图片id
      this.images.forEach(item => {
        // console.log(item)
        this.filesId.push(item.id)
      })
      // console.log(this.filesId)
      const data = {
        ids: this.filesId,
        f_description: this.questionvalue,
        f_customer_name: this.nameinfo,
        f_customer_phnum: this.telinfo,
        f_customer_org: this.workinfo,
        f_sn_no: this.snidinfo,
        f_salesman_id: this.usernameId, // 业务员
        f_salesman_name: this.usernameinfo, // 业务员
        f_project_id: this.ordervalue,
        f_address: this.addressvalue,
        f_remark: this.remarksvalue,
        f_work_order_type_id: this.orderId,
        f_work_order_type: this.orderName

      }
      // console.log(data)
      if (!this.addressvalue || !this.telinfo || !this.nameinfo || !this.usernameinfo || !this.questionvalue) {
        this.toastShow = true;
        this.toastValue = '请填写完整的信息'
      } else {
        this.axios
          .post('workOrder/saveInnerWorkOrder.do', data)
          .then(res => {
            // console.log(res)
            if (res.data.res == 'true') {
              this.toastShow = true
              this.toastValue = '工单提交成功'
            } else {
              const {error} = res.data
              this.toastShow = true
              this.toastValue = error
            }
          })
      }


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
.btn {
  position: fixed;
  z-index:999;
  bottom: 0;
  border-radius: 0px;
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
</style>
