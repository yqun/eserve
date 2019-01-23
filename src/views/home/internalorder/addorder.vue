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
      <file-upload v-model="files" post-action="/">Upload file</file-upload>
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
               placeholder="请输入客户单位"
               type="text">
      </x-input>
      <x-input title="设备SN号"
               :show-clear="false"
               text-align="right"
               v-model="snidinfo"
               placeholder="请输入设备SN号"
               type="text">
      </x-input>
      <x-input title="业务员"
               :show-clear="false"
               text-align="right"
               v-model="usernameinfo"
               placeholder="请输入业务员"
               type="text">
      </x-input>
      <selector title="所属项目"
                direction="rtl"
                :options="order"
                v-model="ordervalue"
                placeholder="请选择单位">
      </selector>
    </group>
    <!-- 服务器地址 -->
    <group>
      <div style="float: left; width: 70%">
        <x-textarea placeholder="服务地址" v-model="addressvalue" :rows="2" :cols="10"></x-textarea>
      </div>
      <div style="float: left; width: 30%">
        <x-button :gradients="btncolor" style="margin-top: 13px;" link="">常用地址</x-button>
      </div>
    </group>
    <group style="margin-bottom: 42px;">
      <x-textarea placeholder="备注" v-model="remarksvalue" :rows="2" :cols="10"></x-textarea>
    </group>
    <x-button :gradients="btncolor" class="btn">提交</x-button>
  </div>
</template>

<script>
export default {
  name: "addorder",
  data() {
    return {
      // 图片上传
      files: [],
      // 问题描述
      questionvalue: '',
      // 项目基本信息
      nameinfo: '',
      telinfo: '',
      workinfo: '',
      snidinfo: '',
      usernameinfo: '',
      order: [{key:1, value:'金山顶尖'},{key:2, value:'进口产品'}],
      ordervalue: '',
      // 服务器地址
      addressvalue: '',
      btncolor: ['dodgerblue', 'dodgerblue'],
      // 备注
      remarksvalue: '',
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

</style>
