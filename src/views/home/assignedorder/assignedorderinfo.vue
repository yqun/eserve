<template>
  <div class="fixedpadding">
    <x-header style="background-color:dodgerblue;color:#fff;">
      <span>工单详情</span>
      <x-icon slot="overwrite-left"
              type="ios-arrow-left"
              size="30"
              @click="$router.push($router.path)"
              style="fill:#fff;position:relative;top:-5px;left:-3px;"></x-icon>
    </x-header>
    <group title="基本信息">
      <x-input type="text" disabled value="123" text-align="right" title="问题"></x-input>
      <x-input type="text" disabled value="123" text-align="right" title="工单状态"></x-input>
      <x-input type="text" disabled value="123" text-align="right" title="处理单位名称"></x-input>
      <x-input type="text" disabled value="123" text-align="right" title="联系方式"></x-input>
      <x-input type="text" disabled value="123" text-align="right" title="创建人"></x-input>
      <x-input type="text" disabled value="123" text-align="right" title="创建时间"></x-input>
      <x-input type="text" disabled value="123" text-align="right" title="客户名称"></x-input>
      <x-input type="text" disabled value="123" text-align="right" title="客户电话"></x-input>
      <x-input type="text" disabled value="123" text-align="right" title="客户单位"></x-input>
      <x-input type="text" disabled value="123" text-align="right" title="服务地址"></x-input>
      <x-input type="text" disabled value="123" text-align="right" title="工单类别"></x-input>
      <x-input type="text" disabled value="123" text-align="right" title="SN号码"></x-input>
      <x-input type="text" disabled value="123" text-align="right" title="项目编号"></x-input>
      <x-input type="text" disabled value="123" text-align="right" title="资产类别"></x-input>
      <x-input type="text" disabled value="123" text-align="right" title="业务员"></x-input>
      <x-input type="text" disabled value="123" text-align="right" title="是否确认"></x-input>
      <x-input type="text" disabled value="123" text-align="right" title="确认时间"></x-input>
      <x-input type="text" disabled value="123" text-align="right" title="指派人员"></x-input>
      <x-input type="text" disabled value="123" text-align="right" title="备注"></x-input>
    </group>
    <group title="进度信息" style="margin-bottom: 40px;">
      <timeline class="timeline-demo">
        <timeline-item v-for="(i,index) in count" :key="index">
          <p :class="[index === 0 ? 'recent' : '']">李万龙 {{index + 1}}</p>
        </timeline-item>
      </timeline>
    </group>
    <x-button :gradients="btncolor" class="btnsubmit">指派工单</x-button>
  </div>
</template>

<script>
export default {
  name: "orderinfo",
  data () {
    return {
      count: ['','','',''],
      btncolor: ['dodgerblue', 'dodgerblue'],
    }
  },
}
</script>

<style scoped>
.vux-header {
  position:fixed;
  top: 0;
  z-index: 999;
  width: 100%;
}
.timeline-demo p {
  color: #666;
  font-weight: normal;
}
.timeline-demo .recent {
  color: deepskyblue;
}
.btnsubmit {
  position: fixed;
  bottom: 0;
  z-index:999;
  border-radius: 0px;
}
</style>
