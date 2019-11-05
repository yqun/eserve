<template>
  <div class="fixedpadding">
    <x-header style="background-color:dodgerblue;color:#fff;">
      <span>填报工作内容</span>
      <x-icon slot="overwrite-left"
              type="ios-arrow-left"
              size="30"
              @click="$router.push('/performorderinfo')"
              style="fill:#fff;position:relative;top:-5px;left:-3px;"></x-icon>
    </x-header>
    <!-- 其他类 -->
    <!-- 预计完成时间 -->
    <group v-if="!isPreSale && !isStandard">
      <datetime v-model="finishDate" format="YYYY-MM-DD HH:mm" title="预计完成时间"></datetime>
    </group>

    <!-- 工作内容 -->
    <group v-if="!isPreSale && !isStandard">
      <x-textarea placeholder="工作内容" v-model="workContent"></x-textarea>
    </group>
    <!-- 工时 -->
    <group v-if="!isPreSale && !isStandard">
      <x-input title="工时(小时)" :show-clear="false" v-model="workDate" :is-type="be2333"></x-input>
    </group>
    <p v-if="!isPreSale && !isStandard" style="color: red;font-size:12px;margin-left: 10px;">注意：工时必须为0.5的整数倍</p>
    <!-- 交通费用，行驶里程 -->
    <group v-if="!isPreSale && !isStandard">
      <x-input title="交通费用(元)" placeholder="交通费用(元)" :show-clear="false" v-model="transportationCost"></x-input>
      <x-input title="行驶里程(公里)" placeholder="行驶里程(公里)" :show-clear="false" v-model="mileage"></x-input>
    </group>
    <!-- 其他类 -->
    <!-- 标案类 -->
    <group v-if="isStandard">
      <datetime v-model="doc_done_time" format="YYYY-MM-DD HH:mm" title="项目完成时间"></datetime>
      <x-input text-align="right" v-model="bid_win_sum" placeholder="请输入中标金额" :show-clear="false" :is-type="isNmber">
        <span slot="label">中标金额(元)<b>*</b></span>
      </x-input>
      <x-number title="标书本数<b>*</b>" v-model="bid_doc_count" :min="0"></x-number>
    </group>
    <group title="是否中标" v-if="isStandard">
      <checker v-model="winBid" class="radio" default-item-class="radio-item" selected-item-class="radio-item-selected">
        <div><checker-item value="false"></checker-item>未中标</div>
        <div><checker-item value="true"></checker-item>已中标</div>
      </checker>
    </group>
    <!-- 售前服务 -->
    <group v-if="isPreSale">
      <cell v-for="(item, index) in serverCategory" :key="item.id">
        <span slot="title">
          {{item.name}}
          <p v-if="item.name!=='现场支持'&&item.name!=='图纸设计'" style="font-size:12px;color: red;">费用:{{item.totalMoney}}元</p>
          <p v-if="item.name=='现场支持'" style="font-size:12px;color: red;">费用:{{item.totalMoney}}元</p>
          <p v-if="item.name=='图纸设计'" style="font-size:12px;color: red;">费用:{{item.totalMoney}}元</p>
        </span>
        <div>
          <inline-x-number width="30px" :min="0" v-model="item.manufactorNum" @on-change="changeMoney(item)">
          </inline-x-number>
          <span v-if="item.name !== '现场支持' && item.name !== '图纸设计' " style="vertical-align:super;font-size:12px;color:red;">咨询厂家数</span>
          <span v-if="item.name == '现场支持'" style="vertical-align:super;font-size:12px;color:red;">　支持次数</span>
          <span v-if="item.name == '图纸设计'" style="vertical-align:super;font-size:12px;color:red;">制作图张数</span>
        </div>
      </cell>
      <x-input title="本次费用(元)" disabled v-model="f_cost" text-align="right"></x-input>
    </group>
    <!-- 图片上传 -->
    <group v-if="!isStandard">
      <!-- 图片展示 -->
      <div v-transfer-dom>
        <previewer :list="filesImg" ref="previewer" :options="options"></previewer>
      </div>
      <!-- vux-uploader 图片上传 -->
      <!--<uploader-->
        <!--:max="5"-->
        <!--:handle-click="false"-->
        <!--:autoUpload="true"-->
        <!--:show-header="true"-->
        <!--:upload-url="uploadUrl"-->
        <!--name="file"-->
        <!--:images="images"-->
        <!--size="small"-->
        <!--:previmg="filesImg"-->
        <!--@preview="show"-->
      <!--&gt;</uploader>-->

      <el-upload class="upload-demo" ref="elUpload"
                 :action="uploadUrl" multiple
                 :on-success="uploadSuccess"
                 :on-remove="uploadRemove"
                 :file-list="fileList">
        <span @click="uploadClick" class="uploadTxt">上传文件</span>
      </el-upload>
    </group>
    <!-- 工单完成情况， 备注 -->
    <group title="工单完成情况">
      <checker v-model="radio" class="radio" default-item-class="radio-item" selected-item-class="radio-item-selected">
        <div><checker-item value="未完成" :disabled="isStandard"></checker-item>未完成</div>
        <div><checker-item value="已完成"></checker-item>已完成</div>
      </checker>
      <!-- 备注 -->
      <x-textarea :max="200" v-model="textareaval" placeholder="备注" :show-counter="false" :rows="5" :cols="30">
      </x-textarea>
    </group>
    <x-button :gradients="btncolor" class="btnsubmit" @click.native="submitData()">提交
    </x-button>
  </div>
</template>

<script>
// import Uploader from 'vux-uploader'
import Uploader from '../../../components/vux-uploader/src/main'
import { TransferDom } from 'vux'
export default {
  name: "writeworkcontent",
  components: {
    Uploader,
  },
  directives: {
    TransferDom,
  },
  data() {
    return {
      fileList: [], // element-ui上传的文件列表
      work_order_type: '', //工单类型
      be2333: function (value) {
        return {
          valid: value/0.5%1 === 0,
          msg: '请输入0.5的整数倍'
        }
      },
      isNmber: function (value) {
        return {
          valid: !isNaN(value),
          msg: '请输入数字'
        }
      },
      token: '',
      id: 0, // 工单进度id
      btncolor: ['dodgerblue', 'dodgerblue'],
      inquiry_count: 0, //项目询价
      budget_count: 0, //预算编制
      f_cost: 0,
      serverCategory: [], // 服务类别

      doc_done_time: '', //项目完成时间
      bid_win_sum: '', //中标金额
      bid_doc_count: 0, // 标书本数
      winBid: 'true',

      finishDate: '', // 完成时间
      workDate: 0, // 工时
      transportationCost: '', // 交通费用
      mileage: '', // 行驶里程
      radio: '已完成', //完成情况
      textareaval: '', // 备注
      workContent: '', // 工作内容
      // 图片上传
      images: [],
      filesId: [],
      filesImg: [],
      options: {
        getThumbBoundsFn(index) {
          let thumbnail = document.querySelectorAll(".previewer-demo-img")[index];
          let pageYScroll = window.pageYOffset || document.documentElement.scrollTop;
          let rect = thumbnail.getBoundingClientRect();
          return { x: rect.left, y: rect.top + pageYScroll, w: rect.width };
        }
      }, // options
    }
  },
  computed: {
    index() {
      return this.$store.state.navIndex
    },
    orderId() {
      return this.$store.state.orderId
    },
    uploadUrl() {
      return `${this.axiosUrl}system/uploadFile.do?token=${this.token}`
    },
    isStandard() {
      let flag = false;
      const str = this.work_order_type;
      if (str) {
        const index = str.indexOf("标案");
        if (index != -1) flag = true;
        return flag;
      }
    },
    isPreSale() {
      let flag = false;
      const str = this.work_order_type;
      if (str) {
        const index= str.indexOf('售前');
        if (index != -1) flag = true;
        return flag;
      }
    },
  },
  created() {
    this.token = window.sessionStorage.getItem('token')
    this.getquery()
    this.getOrderInfo()
    this.getwritedinfo()
  },
  methods: {
    uploadClick() {
      var u = navigator.userAgent;
      var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
      var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
      if(isAndroid){}
      else if(isiOS){
        this.$refs.elUpload.$refs['upload-inner'].handleClick()
      }else{}
      // console.log(this.$refs.elUpload.$refs['upload-inner'].handleClick())
    },
    // 获取参数
    getquery() {
      const date = this.$route.query.date
      this.work_order_type = this.$route.query.work_order_type
      if (date) {this.finishDate = date}
    },
    // 获取工单详情
    getOrderInfo() {
      this.axios
        .get(`workOrder/findEntityById.do?id=${this.orderId}`)
        .then(res => {
          // console.log('orderinfo', res)
          const {data} = res
          // this.orderInfo = res.data
          const ids = data.f_presale_type_ids.split(',');
          const name = data.f_presale_type_name.split(',');
          let codeArr = ['f_inquiry_count', 'f_budget_count', 'f_plan_count', 'f_project_count', 'f_sheet_count', 'f_gld_count', 'f_site_count', 'f_zltbcs_count', 'f_support_count', 'f_doccheck_count'];
          let moneyCodeArr = ['inquiry_cost','budget_cost','plan_cost','project_cost','sheet_cost', 'gld_cost','site_cost','zltbcs_cost','support_cost','doccheck_cost'];
          ids.forEach((item, index) => {
            this.serverCategory.push({
              name: name[index],
              code: codeArr[item - 35],
              id: item,
              manufactorNum: 0,
              totalMoney: 0,
              totalMoneyCode:moneyCodeArr[item - 35]
            })
          })
          // console.log(this.serverCategory)
        })
    },
    // 获取用户之前填写的数据
    getwritedinfo() {
      this.axios
        .get(`orderLog/findOrderLogByWorkOrderAndUserToday.do?f_work_order_id=${this.orderId}`)
        .then(res => {
          // console.log(res)
          const {orderLog} = res.data
          if (res.data.res == 1) {
            this.id = orderLog.id
            this.workContent = orderLog.f_work_content
            this.workDate = orderLog.f_work_house // 工时
            this.transportationCost = orderLog.f_farse // 交通费用
            this.mileage = orderLog.f_mileage //行驶里程
            if (this.work_order_type != '标案类') this.radio = orderLog.f_finished? '已完成':'未完成' // 工单完成情况
            // this.filesId = orderLog.ids, // 图片id
            this.textareaval = orderLog.f_remark// 备注
          }
        })
    },
    changeMoney(info) {
      console.log(info)
      this.axios
        .get(`orderLog/findLogTimeCount.do?f_work_order_id=${this.orderId}&f_field_name=${info.code}`)
        .then(res => {
          // console.log(res)
          const {state, count} = res.data
          if (!state) return false;
          const discount = this.computeDiscount(count);
          const computeMoney = this.computeMoney(info);
          if (info.id == 44) {
            info.totalMoney = computeMoney
          }
          else if (info.id == 39) {
            info.totalMoney = computeMoney*discount*info.manufactorNum
          }
          else {
            info.totalMoney = computeMoney*discount
          }
          this.f_cost = 0;
          this.serverCategory.forEach((item) => {
            this.f_cost += item.totalMoney
          })
          // console.log(this.f_cost)
        })
    },
    computeDiscount(count) { // 计算折扣
      switch(count) {
        case 0:
          return 1;
        case 1:
          return 0.8;
        case 2:
          return 0.6;
        case 3:
          return 0.4;
        case 4:
          return 0.2;
        default:
          return 0;
      }
    },
    computeMoney(info) { // 计算不同类别，不同金额
      if (info.manufactorNum <= 0){
        return 0;
      }
      else if (info.manufactorNum > 0 && info.manufactorNum <= 5) {
        switch(info.id * 1) {
          case 37:
          case 38:
          case 43:
            return 1800;
          case 36:
            return 1200;
          case 40:
            return 1000;
          case 35:
          case 42:
          case 41:
            return 800;
          case 44:
            return 500;
          case 39:
            return 300;
        }
      }
      else if ( info.manufactorNum >= 6 && info.manufactorNum <= 10) {
        switch(info.id*1) {
          case 37:
          case 38:
          case 43:
            return 3600;
          case 36:
            return 2400;
          case 40:
            return 2000;
          case 35:
          case 42:
            return 1600;
          case 41:
          case 44:
            return 800;
          case 39:
            return 300;
        }
      }
      else if ( info.manufactorNum >= 11 && info.manufactorNum <= 20) {
        switch(info.id*1) {
          case 37:
          case 38:
          case 43:
            return 7200;
          case 36:
            return 4800;
          case 40:
          case 35:
          case 42:
            return 4000;
          case 41:
            return 800;
          case 44:
            return 1000;
          case 39:
            return 300;
        }
      }
      else if ( info.manufactorNum > 20) {
        switch(info.id*1) {
          case 37:
          case 38:
          case 43:
            return 15000;
          case 36:
          case 40:
          case 41:
            return 8000;
          case 35:
          case 42:
            return 6000;
          case 44:
            return 2000;
          case 39:
            return 300;
        }
      }
    },
    // 展示 图片
    show (index) {
      // console.log(index)
      this.$refs.previewer.show(index)
    },
    uploadSuccess(response, file, fileList) {
      // console.log(response, file, fileList)
      this.filesId.push(response.id)
    },
    uploadRemove(file, fileList) {
      // console.log(file, fileList)
      const index = this.filesId.indexOf(file.response.id)
      this.filesId.splice(index, 1)
      // console.log(this.filesId)
    },
    // 提交表单
    submitData() {
      // 获取图片id
      // if(this.images.length) {this.images.forEach(item => {this.filesId.push(item.id)})}
      const data = {
        id: this.id,
        f_expected_date: this.finishDate, // 预计完成时间
        f_work_order_id: this.orderId,
        f_work_content: this.workContent, // 工作内容
        f_work_house: this.workDate, // 工时
        f_farse: this.transportationCost, // 交通费用
        f_mileage: this.mileage, //行驶里程
        ids: this.filesId, // 图片id
        f_completed: this.radio, // 工单完成情况
        f_remark: this.textareaval, // 备注
      }
      // console.log(data)
      if (this.isPreSale) {
        this.serverCategory.forEach(item => {
          data[item.code] = item.manufactorNum
          data[item.totalMoneyCode] = item.totalMoney
        })
        data.f_cost = this.f_cost
      }
      else if (!this.isStandard && !this.isPreSale) {
        // 判断  必选项
        if (!this.finishDate) return this.$vux.toast.text('请填写预计完成时间')
        if (!this.radio) return this.$vux.toast.text('请填写工单完成情况')
        // 判断 工时大于0  并且是0.5的倍数
        if (this.workDate < 0 && this.workDate/0.5%1 !== 0) return this.$vux.toast.text('请正确输入工时')
        // 判断交通费用和行驶里程
        if (this.mileage && this.transportationCost) return this.$vux.toast.text('交通费用和行驶里程只能任选其一')
      }
      else if (this.isStandard) {
        if (!this.doc_done_time) return this.$vux.toast.text('请填写项目完成时间');
        if (!this.bid_win_sum) return this.$vux.toast.text('请填写中标金额');
        if (isNaN(this.bid_win_sum)) return this.$vux.toast.text('请输入正确的中标金额');
        if (this.bid_win_sum.slice(this.bid_win_sum.indexOf('.')).length > 3) return this.$vux.toast.text('中标金额小数点保存到两位');
        if (!this.bid_doc_count) return this.$vux.toast.text('请填写标书本数');
        if (!this.winBid) return this.$vux.toast.text('请填写标书本数');
        data.f_doc_done_time = this.doc_done_time;
        data.f_bid_win_sum = this.bid_win_sum;
        data.f_bid_doc_count = this.bid_doc_count;
        data.f_bid_win = this.winBid;
      }
      console.log(data)
      this.sendData(data)
    }, // submitData
    // 向后台发送数据
    sendData(data) {
      console.log(111)
      this.axios
        .post(`orderLog/saveOrderLog.do`, data)
        .then(res => {
          if (!res.data.res) return false;
          this.$vux.toast.text('提交成功')
          setTimeout(() => {
            // 页面跳转
            this.$router.push('/performlist')
          }, 800) // end setTimeout
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
  width: 100%;
  position: fixed;
  bottom: 0;
  z-index:999;
  border-radius: 0;
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
.upload-demo {
  padding: 10px 15px;
}
.upload-demo .uploadTxt {
  font-size: 14px;
  border-bottom: 1px solid dodgerblue;
  color: dodgerblue;
}
</style>
