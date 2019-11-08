<template>
  <div class="fixedpadding" style="padding-bottom: 50px;">
    <x-header style="background-color:dodgerblue;color:#fff;">
      <span>工单详情</span>
      <x-icon slot="overwrite-left"
              type="ios-arrow-left"
              size="30"
              @click="$router.replace('/assignedorderinfo')"
              style="fill:#fff;position:relative;top:-5px;left:-3px;"></x-icon>
    </x-header>
    <group>
      <x-input :disabled="isStandard || isPreSale" :show-clear="false" v-model="f_description" text-align="right" title="问题">
      </x-input>
      <x-input title="工单类别" disabled text-align="right" v-model="work_order_type"></x-input>
      <!-- 业务员 @click.native="toSalesman('业务员')"-->
      <x-input disabled v-model="usernameinfo" text-align="right" title="业务员">
      </x-input>
      <selector v-if="!isStandard && !isPreSale" title="资产类别" direction="rtl" :options="assets" v-model="assestkey" placeholder="请选择资产类别">
      </selector>
      <x-input title="项目名称" :show-clear="false" text-align="right" v-model="project_name"></x-input>
      <x-input title="项目编号" :disabled="isStandard || isPreSale" text-align="right" v-model="project_number"></x-input>
      <x-input v-if="isStandard" title="招标编号" text-align="right" v-model="bid_number"></x-input>
      <x-input v-if="!isStandard && !isPreSale" :show-clear="false" v-model="f_customer_name" text-align="right" title="客户名称"></x-input>
      <x-input v-if="!isStandard && !isPreSale" :show-clear="false" v-model="f_customer_phnum" text-align="right" title="客户电话"></x-input>
      <x-input v-if="!isStandard" :disabled="isPreSale" :show-clear="false" v-model="f_customer_org" text-align="right" title="客户单位"></x-input>
      <x-input v-if="!isStandard && !isPreSale" :show-clear="false" v-model="f_sn_no" text-align="right" title="SN号码"></x-input>
      <x-input v-if="!isStandard && !isPreSale" :disabled="isStandard" v-model="f_address" text-align="right" title="服务地址"></x-input>
      <!-- 售前服务 -->
      <x-input v-if="isPreSale" disabled text-align="right" v-model="presale_type_name" title="服务内容"></x-input>
      <!-- 售前服务 -->
      <!-- 标案类 -->
      <x-input v-if="isStandard" text-align="right" v-model="purchaser_name" placeholder="请填写采购人名称">
        <span slot="label">采购人名称<b>*</b></span>
      </x-input>
      <x-input v-if="isStandard" text-align="right" v-model="purchaser_org_name" placeholder="请填写采购代理机构名称">
        <span slot="label">采购代理机构名称<b>*</b></span>
      </x-input>
      <datetime v-if="isStandard" readonly title="开标时间" v-model="bidingDate" format="YYYY-MM-DD HH:mm"></datetime>
      <x-number v-if="isStandard" readonly title="标书本数" v-model="bidingCount" :min="0"></x-number>
      <!-- end标案类 -->
      <x-input disabled v-model="f_name" text-align="right" @click.native="toSalesman('指派人员')" placeholder="已指派人员">
        <span slot="label">已指派人员<b>*</b></span>
      </x-input>
      <x-input :disabled="isStandard || isPreSale" v-model="f_remark" text-align="right" title="备注" placeholder="备注"></x-input>
    </group>
    <x-button :gradients="btncolor" class="btnsubmit" @click.native="saveF_name()">保存修改</x-button>
  </div>
</template>

<script>
import axios from 'axios'
import queryString from 'querystring'
export default {
  name: "savechangeorder",
  data() {
    return{
      userId: 0,// 判断业务员  还是 指派人员
      btncolor: ['dodgerblue', 'dodgerblue'],
      work_order_type: '',
      // 数据
      project_name: '',
      oldProjectName: '',
      project_number: '',
      bid_number: '',
      bidingDate: '',
      bidingCount: '',
      presale_type_name: '', // 服务内容
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
      f_sn_no: '',
      f_nameId:[],
      purchaser_name: '', // 采购人名称
      purchaser_org_name: '', // 采购代理机构名称
    }
  },
  computed: {
    orderId() {
      return this.$store.state.orderId
    },
    isStandard() {
      let flag = false;
      const str = this.work_order_type
      if (str) {
        const index = str.indexOf("标案");
        if (index != -1) flag = true;
        return flag;
      }
    },
    isPreSale() {
      let flag = false;
      const str = this.work_order_type
      if (str) {
        const index= str.indexOf('售前')
        if (index != -1) flag = true;
        return flag;
      }
    },
  },
  mounted() {
    this.getOrderInfo()

    this.getassets()
    this.getservice()
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
      this.f_name = '';
      this.f_nameId = [];
      jsonData.forEach(item => {
        this.f_name += "　" + item.name
        this.f_nameId.push(item.id)
      })
    }
  },
  methods: {
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
          console.log(res)
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
          console.log(res)
          const {status, data} = res
          if (status != 200) return false;
          this.project_name = data.f_project_name
          this.oldProjectName = data.f_project_name // 用于判断项目名称是否修改
          this.project_number = data.f_project_number
          this.bid_number = data.f_bid_number?data.f_bid_number:data.f_project_number
          this.bidingDate = data.f_bid_open_date
          this.bidingCount = data.f_bid_doc_count
          this.purchaser_name = data.f_purchaser_name
          this.purchaser_org_name = data.f_purchaser_org_name
          this.f_description = data.f_description
          this.f_customer_name = data.f_customer_name
          this.f_customer_phnum = data.f_customer_phnum
          this.f_customer_org = data.f_customer_org
          this.f_address = data.f_address
          this.f_remark = data.f_remark
          this.assestkey = data.f_equmentType_id
          this.servicekey = data.f_work_order_type_id
          this.work_order_type = data.f_work_order_type
          this.usernameinfo = data.f_salesman_name
          this.usernameId = data.f_salesman_id
          this.f_sn_no = data.f_sn_no
          this.presale_type_name = data.f_presale_type_name
          if (data.f_worker_count > 0) this.getUser(); // 如果有指派人员，获取指派人员
        })
    },
    // 获取指派人员
    getUser() {
      this.axios
        .get(`workOrder/getWorkersByWorkOrder.do?id=${this.orderId}`)
        .then(res => {
          console.log(1,res)
          const {status, data} = res
          if (status != 200) return false;
          if (data.length != 0) {
            data.forEach(item => {
              this.f_nameId.push(item.id)
              this.f_name += "　" + item.f_name
            })
          }
        })
    },
    // 指派人员 保存
    saveF_name() {
      // 获取数据  发送请求  资产类别 value
        let assestval, servicevalue;
      if(this.assets.length) {
        this.assets.forEach(item => {
          if (this.assestkey == item.key) return assestval = item.value
        })
      }
      if(this.service.length) {
        this.service.forEach(item => {
          if (this.servicekey == item.key) return servicevalue = item.value
        })
      }
      const data = {
        id: this.orderId,
        f_description: this.f_description, // 问题
        f_customer_name: this.f_customer_name, // 客户名称
        f_customer_phnum: this.f_customer_phnum,// 客户电话
        f_customer_org: this.f_customer_org, // 客户单位
        f_salesman_name: this.usernameinfo, // 业务员
        f_salesman_id: this.usernameId, // 业务员id
        f_sn_no: this.f_sn_no, // sn号
        f_address: this.f_address, // 服务器地址
        f_equmentType_id: this.assestkey, //资产类别
        f_equmentType_name: assestval,
        f_work_order_type_id: this.servicekey, // 工单类别
        f_work_order_type: servicevalue,
        f_remark: this.f_remark, // 备注
        // 标案类
        f_purchaser_name: this.purchaser_name,
        f_purchaser_org_name: this.purchaser_org_name,
      };
      if (!this.f_name) return this.$vux.toast.text('请选择指派人员')
      if (this.isPreSale) {
        data.f_project_name = this.project_name
      }
      else if (!this.isPreSale && !this.isStandard) {
        if (!this.usernameinfo || !this.assestkey || !this.servicekey) return this.$vux.toast.text('请填写完整信息');
      }
      else if (this.isStandard) {
        if (!this.purchaser_name) return this.$vux.toast.text('请填写采购人员名称');
        if (!this.purchaser_org_name) return this.$vux.toast.text('请填写采购代理机构名称');
        data.f_project_name = this.project_name
        data.f_purchaser_name = this.purchaser_name
        data.f_purchaser_org_name = this.purchaser_org_name
        data.f_bid_number = this.bid_number
      }

      this.axios
        .post('workOrder/updateWorkers.do',{id: this.orderId, ids: this.f_nameId})
        .then(res => {
          console.log(res)
          if (res.data.res !== 'true') return this.$vux.toast.text('指派人员保存失败')
          this.savechange(data)
        })
    },
    // 保存修改
    savechange(data) {
      console.log(data)
      this.axios
        .post('workOrder/updateWorkOrderByDis.do', data)
        .then(res => {
          // console.log(res)
          if (res.data.res !== 'true') return this.$vux.toast.text('保存失败')
          this.$vux.toast.text('保存成功')
          if (this.project_name != this.oldProjectName) {
            this.saveProjectName()
          }
          else {
            setTimeout(() => {this.$router.push('/')}, 800)
          }
        })

    },
    // 保存项目名称
    saveProjectName() {
      const data = {
        code: this.project_number,
        name: this.project_name
      }
      axios.post(`http://imp.kingtop.com.cn:8080/platformServer/eService/updateProjectName`, queryString.stringify(data))
        .then(res => {
          console.log(res)
          if (res.data != 1) return this.$vux.toast.text('项目名称保存成功')
          setTimeout(() => {this.$router.push('/')}, 800);

        })
    },
    // 跳转选择业务员
    toSalesman(user) {
      if (this.work_order_type == '标案类' && user == '业务员') return false;
      if (this.work_order_type == '售前服务' && user == '业务员') return false;
      let userId = 2
      if (user == '业务员') {
        userId = 1
      }
      this.$store.commit('changeSalesmanBackRouter', this.$route.path)
      this.$router.push({
        path: '/salesman',
        query: {
          userId: userId
        }
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
.btnsubmit {
  position: fixed;
  bottom: 0;
  z-index:999;
  border-radius: 0px;
}
</style>
