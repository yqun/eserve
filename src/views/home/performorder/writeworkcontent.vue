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
    <!-- 预计完成时间 -->
    <group>
      <datetime
        v-model="finishDate"
        title="预计完成时间">
      </datetime>
    </group>
    <!-- 工作内容 -->
    <group>
      <x-textarea placeholder="工作内容" v-model="workContent"></x-textarea>
    </group>
    <!-- 工时 -->
    <group>
      <x-input title="工时(小时)" :show-clear="false" v-model="workDate" :is-type="be2333"></x-input>
    </group>
    <p style="color: red;font-size:12px;margin-left: 10px;">注意：工时必须为0.5的整数倍</p>
    <!-- 图片上传 -->
    <group>
      <!-- 图片展示 -->
      <div v-transfer-dom>
        <previewer :list="filesimg"
                   ref="previewer"
                   :options="options">
        </previewer>
      </div>
      <!-- 图片上传 -->
      <file-upload v-model="files"
                   name="file"
                   ref="upload"
                   :post-action='uploadUrl'
                   put-action
                   @input-file="inputFile"
                   multiple>
        <i class="iconfont icon-tianjiatupian"></i>
      </file-upload>
      <!-- 图片展示列表 -->
      <ul>
        <li class="previewpic" v-for="(file,index) in files" :key="index">
          <img class="previewer-demo-img" :src="file.blob" height="100" width="100" @click="show(index)"/>
          <i class="iconfont icon-quancha" @click.prevent="remove(file,index)"></i>
        </li>
      </ul>
    </group>
    <!-- 交通费用，行驶里程 -->
    <group>
      <x-input title="交通费用(元)" placeholder="交通费用(元)" :show-clear="false" v-model="transportationCost"></x-input>
      <x-input title="行驶里程(公里)" placeholder="行驶里程(公里)" :show-clear="false" v-model="mileage"></x-input>
    </group>
    <!-- 工单完成情况， 备注 -->
    <group title="工单完成情况">
      <checker v-model="radio"
               class="radio"
               default-item-class="radio-item"
               selected-item-class="radio-item-selected">
        <div><checker-item value="false"></checker-item>未完成</div>
        <div><checker-item value="true"></checker-item>已完成</div>
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
              @click.native="submitData()">
      提交
    </x-button>
    <!-- toast -->
    <toast v-model="toastShow"
           :text="toastValue"
           type="text" :time="800"
           is-show-mask
           position="middle" width="10em"></toast>
  </div>
</template>

<script>
import { TransferDom } from 'vux'
export default {
  name: "writeworkcontent",
  directives: {
    TransferDom,
  },
  data() {
    return {
      be2333: function (value) {
        return {
          valid: value/0.5%1 === 0,
          msg: '请输入0.5的整数倍'
        }
      },
      token: '',
      index: 0,
      orderId: 0,
      btncolor: ['dodgerblue', 'dodgerblue'],
      finishDate: '', // 完成时间
      workDate: 0, // 工时
      transportationCost: '', // 交通费用
      mileage: '', // 行驶里程
      radio: '未完成', //完成情况
      textareaval: '', // 备注
      workContent: '', // 工作内容
      // 图片上传
      files: [],
      filesId: [],
      filesimg: [],
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
      return `http://10.1.1.44:8080/platform/system/uploadFile.do?token=${this.token}`
    }
  },
  created() {
    this.token = window.sessionStorage.getItem('token')
    this.getquery()
    this.getwritedinfo()
  },
  methods: {
    // 获取参数
    getquery() {
      this.index = this.$route.query.index
      this.orderId = this.$route.query.id
    },
    // 获取用户之前填写的数据
    getwritedinfo() {
      console.log(this.orderId)
      this.axios
        .get(`orderLog/findOrderLogByWorkOrderAndUserToday.do?f_work_order_id=${this.orderId}`)
        .then(res => {
          console.log(res)
          const {orderLog} = res.data
          if (res.data.res == 1) {
            this.workContent = orderLog.f_work_content
            this.finishDate = orderLog.f_expected_date, // 预计完成时间
            this.workDate = orderLog.f_work_house, // 工时
            this.transportationCost = orderLog.f_farse, // 交通费用
            this.mileage = orderLog.f_mileage, //行驶里程
            this.radio = orderLog.f_finished.toString(), // 工单完成情况
            this.filesId = orderLog.ids, // 图片id
            this.textareaval = orderLog.f_remark// 备注
          }
        })
    },
    // 文件上传
    inputFile(newFile, oldFile) {
      if (newFile && oldFile) {

        // 上传成功
        if (newFile.success !== oldFile.success) {
          this.filesId.push(newFile.response.id)
          // console.log('success', newFile.response)

          // 过滤非图片文件
          // 不会添加到 files 去
          if (!/\.(jpeg|jpe|jpg|gif|png|webp)$/i.test(newFile.name)) {
            return prevent()
          }
          // 创建 `blob` 字段 用于缩略图预览
          newFile.blob = ''
          let URL = window.URL || window.webkitURL
          if (URL && URL.createObjectURL) {
            newFile.blob = URL.createObjectURL(newFile.file)
          }
          this.filesimg.push({
            msrc: URL.createObjectURL(newFile.file),
            src: URL.createObjectURL(newFile.file),
          });
        }
      }

      // 自动上传
      if (Boolean(newFile) !== Boolean(oldFile) || oldFile.error !== newFile.error) {
        if (!this.$refs.upload.active) {
          this.$refs.upload.active = true
        }
      }
    },
    // 删除图片
    remove(file,index) {
      this.$refs.upload.remove(file)
      this.filesimg.splice(index, 1)
      this.filesId.splice(index, 1)
    },
    // 展示 图片
    show (index) {
      this.$refs.previewer.show(index)
    },
    // 提交表单
    submitData() {
      const data = {
        f_expected_date: this.finishDate, // 预计完成时间
        f_work_content: this.workContent, // 工作内容
        f_work_house: this.workDate, // 工时
        f_farse: this.transportationCost, // 交通费用
        f_mileage: this.mileage, //行驶里程
        f_finished: this.radio, // 工单完成情况
        ids: this.filesId, // 图片id
        f_remark: this.textareaval, // 备注
      }
      // console.log(data)
      // 判断  必选项
      if (!this.finishDate || !this.workContent) {
        this.toastShow = true
        this.toastValue = '请填写完整的信息'
      } else {
        // 判断 工时大于0  并且是0.5的倍数
        if (this.workDate > 0 && this.workDate/0.5%1 === 0) {
          // 判断交通费用和行驶里程
          if (this.mileage && this.transportationCost) {
            this.toastShow = true
            this.toastValue = '交通费用和行驶里程只能任选其一'
          } else {
            this.toastShow = true
            this.toastValue = '提交成功'
            setTimeout(() => {
              // 页面跳转
              this.$router.push({
                path:'/performorderinfo',
                query: {
                  id: this.orderId,
                  index: this.index
                }
              })
            }, 800) // end setTimeout
          } // end if
        } else {
          this.toastShow = true
          this.toastValue = '请正确输入工时'
        } // end if
      } // end if
    } // submitData
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
