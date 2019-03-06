<template>
  <div>
    <x-header style="background-color:dodgerblue;color:#fff;">
      <span>工单详情</span>
      <x-icon slot="overwrite-left"
              type="ios-arrow-left"
              size="30"
              @click="$router.push({path: '/assignedorderinfo', query: {id: orderId, index: index}})"
              style="fill:#fff;position:relative;top:-5px;left:-3px;"></x-icon>
    </x-header>
    <group>
      <x-input :show-clear="false" type="text" v-model="f_description" text-align="right" title="问题"></x-input>
      <x-input :show-clear="false" type="text" v-model="f_customer_name" text-align="right" title="客户名称"></x-input>
      <x-input :show-clear="false" type="text" v-model="f_customer_phnum" text-align="right" title="客户电话"></x-input>
      <x-input :show-clear="false" type="text" v-model="f_customer_org" text-align="right" title="客户单位"></x-input>
      <!-- 业务员 -->
      <x-input type="text"
               v-model="usernameinfo"
               text-align="right"
               title="业务员"
               @on-focus="$router.push({path: '/salesman', query: {id: orderId, index: index, userId: 1}})"></x-input>
      <x-input type="text" disabled v-model="f_address" text-align="right" title="服务地址"></x-input>
      <selector title="资产类别"
                direction="rtl"
                :options="assets"
                v-model="assestkey"
                placeholder="请选择资产类别">
      </selector>
      <selector title="工单类别"
                direction="rtl"
                :options="service"
                v-model="servicekey"
                placeholder="请选择单位">
      </selector>
      <x-input type="text" v-model="f_remark" text-align="right" title="备注"></x-input>
      <x-input type="text"
               v-model="f_name"
               text-align="right"
               @on-focus="$router.push({path: '/salesman', query: {id: orderId, index: index, userId: 2}})"
               title="已指派人员">
      </x-input>
    </group>
    <x-button :gradients="btncolor" class="btnsubmit" @click.native="savechange()">保存修改</x-button>
    <!-- toast -->
    <toast v-model="toastShow"
           :text="toastValue"
           type="text" :time="800"
           is-show-mask
           position="middle" width="10em"></toast>
  </div>
</template>

<script>
export default {
  name: "savechangeorder",
  data() {
    return{
      orderId: 0,
      index:0,
      userId: 0,// 判断业务员  还是 指派人员
      btncolor: ['dodgerblue', 'dodgerblue'],
      // 数据
      f_description: '',
      f_customer_name: '',
      f_customer_phnum: '',
      f_customer_org: '',
      usernameinfo: '',  // 业务员
      usernameId: '', // 业务员id
      f_address: '',
      assestkey: null,
      assets: [],
      servicekey: null,
      service: [],
      f_remark: '',
      f_name: '',
      f_nameId:[],
      // toast
      toastShow: false,
      toastValue: ''
    }
  },
  created() {
    this.getquery()
    this.getOrderInfo()

    this.getassets()
    this.getservice()
    this.getUser()
  },
  activated() {
    this.userId = this.$route.query.userId
    const userArr = this.$route.query.user
    if (!userArr) return false;
    const jsonData = JSON.parse(userArr)
    // 业务员
    if (this.userId == 1) {
      this.usernameinfo = jsonData[0].name
      this.usernameId = jsonData[0].id
    }
    if (this.userId == 2) {
      jsonData.forEach(item => {
        this.f_name += "　" + item.name
        this.f_nameId.push(item.id)
      })
    }
  },
  methods: {
    // 获取参数
    getquery() {
      this.orderId = this.$route.query.id
      this.index = this.$route.query.index
    },
    // 获取资产类别
    getassets() {
      this.axios
        .get('equmentType/findEqumentTypeOfOrg.do')
        .then(res => {
          // console.log(res)
          const {rows} = res.data
          if (!rows.length) return false;
          rows.forEach(item => {
            this.assets.push({
              key:item.id,
              value:item.f_name
            })
          })
        })
    },
    // 获取工单类别
    getservice() {
      this.axios
        .get('workOrderType/findEntityByPage.do')
        .then(res => {
          // console.log(res)
          const {rows} = res.data
          if (!rows.length) return false;
          rows.forEach(item => {
            this.service.push({
              key:item.id,
              value:item.f_type_name
            })
          })
        })
    },
    // 获取工单详情
    getOrderInfo() {
      this.axios
        .get(`workOrder/findEntityById.do?id=${this.orderId}`)
        .then(res => {
          // console.log(res)
          const {status, data} = res
          if (status != 200) return false;
          this.f_description = data.f_description
          this.f_customer_name = data.f_customer_name
          this.f_customer_phnum = data.f_customer_phnum
          this.f_customer_org = data.f_customer_org
          this.f_address = data.f_address
          this.f_remark = data.f_remark
        })
    },
    // 获取指派人员
    getUser() {
      this.axios
        .get(`workOrder/getWorkersByWorkOrder.do?id=${this.orderId}`)
        .then(res => {
          // console.log(res)
          const {status, data} = res
          if (status != 200) return false;
          if (data.length != 0) {
            data.forEach(item => {
              this.f_name += "　" + item.f_name
            })
          }
        })
    },
    // 保存修改
    savechange() {
      if (!this.usernameinfo || !this.assestkey || !this.servicekey) {
        this.toastValue = '请填写完整信息';
        this.toastShow = true;
      } else {
        // 获取数据  发送请求
        // 资产类别 value
        let assestval, servicevalue;
        this.assets.forEach(item => {
          if (this.assestkey == item.key) return assestval = item.value
        })
        this.service.forEach(item => {
          if (this.servicekey == item.key) return servicevalue = item.value
        })
        const data = {
          f_description: this.f_description, // 问题
          f_customer_name: this.f_customer_name, // 客户名称
          f_customer_phnum: this.f_customer_phnum,// 客户电话
          f_customer_org: this.f_customer_org, // 客户单位
          f_salesman_name: this.usernameinfo, // 业务员
          f_salesman_id: this.usernameId, // 业务员
          f_address: this.f_address, // 服务器地址
          f_equmentType_id: this.assestkey, //资产类别
          f_equmentType_name: assestval,
          f_work_order_type_id: this.servicekey, // 工单类别
          f_work_order_type: servicevalue,
          f_remark: this.f_remark, // 备注
        }
        // console.log(data)
        this.axios
          .post('/workOrder/saveDisWorkOrder.do', data)
          .then(res => {
            // console.log(res)
            if (res.data.res == 'true') {
              this.saveF_name()
            } else {
              const {error} = res.data
              this.toastValue = error;
              this.toastShow = true;
            }
          })
      }

    },
    // 指派人员 保存
    saveF_name() {
      const data = {
        id: this.orderId,
        ids: this.f_nameId
      }
      this.axios
        .post('workOrder/updateWorkers.do',data)
        .then(res => {
          // console.log(res)
          if (res.data.res == 'true') {
            this.toastValue = '保存成功';
            this.toastShow = true;
            setTimeout(() => {
              this.$router.push('/')
            }, 800)
          } else {
            this.toastValue = '保存失败';
            this.toastShow = true;
          }
        })
    }
  }
}
</script>

<style scoped>
.btnsubmit {
  position: fixed;
  bottom: 0;
  z-index:999;
  border-radius: 0px;
}
</style>
