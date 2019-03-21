<template>
  <li class="weui-uploader__file">
    <img :src="backgroundImage" alt="" class="previewer-demo-img" style="width: 60px;height: 60px;">
  </li>
</template>

<script>
export default {
  props: {
    backgroundImage: {
      type: String,
      default: ''
    }
  },
  computed: {
    style () {
      return {
        backgroundImage: `url(${this.backgroundImage})`
      }
    }
  }
}
</script>
