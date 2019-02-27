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
        <previewer :list="filesimg"
                   ref="previewer"
                   :options="options">
        </previewer>
      </div>
      <file-upload v-model="files"
                   ref="upload"
                   post-action
                   put-action
                   @input-file="inputFile"
                   @input-filter="inputFilter"
                   multiple>
        <i class="iconfont icon-tianjiatupian"></i>
      </file-upload>
      <ul>
        <li class="previewpic" v-for="(file,index) in files" :key="index">
          <img class="previewer-demo-img" :src="file.blob" height="100" width="100" @click="show(index)"/>
          <i class="iconfont"></i>
        </li>
      </ul>
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
      <x-address :list="userData"
                 title="业务员"
                 v-model="usernameinfo"
                 placeholder="请输入业务员"
                 :show.sync="showAddress">
      </x-address>
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
        <x-textarea placeholder="服务地址" v-focus ref="address" v-model="addressvalue" :rows="2" :cols="10"></x-textarea>
      </div>
      <div style="float: left; width: 35%">
        <x-button :gradients="btncolor" style="margin-top: 13px;" link="/oftenaddress">常用地址</x-button>
      </div>
    </group>
    <group style="margin-bottom: 42px;">
      <x-textarea placeholder="备注" v-model="remarksvalue" :rows="2" :cols="10"></x-textarea>
    </group>
    <x-button :gradients="btncolor" class="btn" @click.native="submitBtn()">提交</x-button>
  </div>
</template>

<script>
import { TransferDom } from 'vux'
import bus from '@/eventbus/eventbus'
export default {
  name: "addorder",
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
      questionvalue: '', // 问题描述
      nameinfo: '',  // 项目基本信息
      telinfo: '', // 客户电话
      workinfo: '',  // 客户单位
      snidinfo: '', // 设备sn号
      usernameinfo: [],  // 业务员
      userData: [
        {
          name: '技术研发部',
          value: '1'
        },
        {
          name: '杨群',
          value: '11',
          parent: '1'
        },
      ], // 业务员信息
      showAddress: false, // 业务员显示
      order: [{key:1, value:'金山顶尖'},{key:2, value:'进口产品'}],
      ordervalue: '',
      // 服务器地址
      addressvalue: '',
      btncolor: ['dodgerblue', 'dodgerblue'],
      // 备注
      remarksvalue: '',
      // 图片上传
      files: [],
      filesimg: [],
      options: {
        getThumbBoundsFn(index) {
          let thumbnail = document.querySelectorAll(".previewer-demo-img")[index];

          let pageYScroll = window.pageYOffset || document.documentElement.scrollTop;

          let rect = thumbnail.getBoundingClientRect();

          return { x: rect.left, y: rect.top + pageYScroll, w: rect.width };
        }
      }// options
    }
  },
  activated() {
    bus.$on('sendAddress', address => {
      this.addressvalue = address
    })
  },
  methods: {
    // 路由跳转
    routerLink() {
      if (this.$router.path == '/oftenaddress') return this.$router.push('/internalorder')
      this.$router.push(this.$router.path)
    },
    inputFilter (newFile, oldFile, prevent) {
      if (newFile && !oldFile) {
        // 添加文件

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
    },
    // 文件上传
    inputFile(newFile, oldFile) {
      if (newFile && oldFile) {
        // 开始上传
        if (newFile.active !== oldFile.active) {
          console.log('Start upload', newFile.active, newFile)
        }
        // 上传进度
        if (newFile.progress !== oldFile.progress) {
          console.log('progress', newFile.progress, newFile)
        }
        // 上传错误
        if (newFile.error !== oldFile.error) {
          console.log('error', newFile.error, newFile)
        }

        // 上传成功
        if (newFile.success !== oldFile.success) {
          console.log('success', newFile.success, newFile)
        }
      }

      if (!newFile && oldFile) {
        // 删除文件

        // 自动删除 服务器上的文件
        if (oldFile.success && oldFile.response.id) {
          // $.ajax({
          //   type: 'DELETE',
          //   url: '/file/delete?id=' + oldFile.response.id,
          // });
        }
      }

      // 自动上传
      if (Boolean(newFile) !== Boolean(oldFile) || oldFile.error !== newFile.error) {
        if (!this.$refs.upload.active) {
          this.$refs.upload.active = true
        }
      }
    },
    // 展示 图片
    show (index) {
      // console.log(index)
      this.$refs.previewer.show(index)
    },
    // 提交按钮
    submitBtn () {
      
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
  bottom: 0;
  border-radius: 0px;
}
/* 文件上传 */
li.previewpic {
  float: left;
}
i.iconfont.icon-tianjiatupian {
  font-size: 60px;
}
</style>
