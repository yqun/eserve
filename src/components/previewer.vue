<template>
  <div v-show="previewerShow" @click="previewerShow = !previewerShow" ref="previewer">
    <img :src="url" alt="" ref="img" :style="imgStyle">
  </div>
</template>

<script>
export default {
  name: "previewer",
  data() {
    return {
      previewerShow: false,
      url: '',
      imgStyle: {}
    }
  },
  mounted() {

  },
  methods: {
    show (url) {
      this.url = url;

      this.$nextTick(() => {
        const w = this.$refs.previewer.clientWidth
        const h = this.$refs.previewer.clientHeight

        const x = this.$refs.img.width
        const y = this.$refs.img.height
        this.imgStyle = {position: 'absolute', margin: 'auto', left: 0, right: 0, top: 0, bottom: 0, width: '50%'};
        console.log(x, w)
        // if (x > w * 2/3) {
        //   this.imgStyle.width = '100%'
        // } else if (x <= w * 2/3 && x > w / 3){
        //   this.imgStyle.width = '50%'
        // }
      });

      this.previewerShow = !this.previewerShow;
    }
  }
}
</script>

<style scoped>
div {
  position: fixed;
  left: 0;
  top: 0;
  z-index: 9999;
  width: 100%;
  height: 100%;
  background-color: rgba(0,0,0,1);
}
</style>
