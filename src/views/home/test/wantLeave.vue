<template>
  <div>
    <div class="imglistbox">
      <img
        class="previewer-demo-img"
        v-for="(item, index) in filesimg"
        :src="item.src"
        width="60"
        height="60"
        @click="show(index)"
      >
    </div>
    <div v-transfer-dom>
      <previewer
        :list="filesimg"
        ref="previewer"
        :options="options"
        @on-index-change="logIndexChange"
      ></previewer>
    </div>
    <file-upload
      ref="upload"
      :maximum="3"
      post-action="/api/upload?classify=study"
      put-action
      v-model="files"
      :multiple="true"
      @input-file="inputFile"
    ></file-upload>
  </div>
</template>

<script>
import Uploader from 'vue-loader';
import { Previewer, TransferDom } from 'vux'
export default {
  name: "wantleave",
  directives: {
    TransferDom
  },
  components: {
    Uploader
  },
  data() {
    return {
      files: [],
      filesimg: [],
      materialimg: "",
      options: {
        getThumbBoundsFn(index) {
          let thumbnail = document.querySelectorAll(".previewer-demo-img")[index];

          let pageYScroll = window.pageYOffset || document.documentElement.scrollTop;

          let rect = thumbnail.getBoundingClientRect();

          return { x: rect.left, y: rect.top + pageYScroll, w: rect.width };
        }
      }
    };
  },
  methods: {
    inputFile(newFile, oldFile) {
      if (newFile && oldFile) {
        // 更新文件

        // 开始上传
        if (newFile.active !== oldFile.active) {
          console.log("Start upload", newFile.active, newFile);

          // 限定最小字节
          /*   if (newFile.size >= 0 && newFile.size < 100 * 1024) {
            newFile = this.$refs.upload.update(newFile, {error: 'size'})
          }*/
        }

        // 上传进度
        if (newFile.progress !== oldFile.progress) {
          console.log("progress", newFile.progress, newFile);
        }

        // 上传错误
        if (newFile.error !== oldFile.error) {
          console.log("error", newFile.error, newFile);
        }

        // 上传成功
        if (newFile.success !== oldFile.success) {
          // console.log('success', newFile.success, newFile)
          //debugger
          if (newFile && !oldFile) {
            // 添加文件
            // 创建 `blob` 字段 用于缩略图预览
            newFile.blob = "";
            let URL = window.URL || window.webkitURL;
            if (URL && URL.createObjectURL) {
              newFile.blob = URL.createObjectURL(newFile.file);
            }
          }
          this.materialimg += newFile.response[0] + "|";

          this.filesimg.push({
            msrc: URL.createObjectURL(newFile.file),
            src: URL.createObjectURL(newFile.file),
            w: 800,
            h: 400
          });
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
      if (
        Boolean(newFile) !== Boolean(oldFile) ||
        oldFile.error !== newFile.error
      ) {
        if (!this.$refs.upload.active) {
          this.$refs.upload.active = true;
        }
      }
    },

    logIndexChange(arg) {
      console.log(arg);
    },
    show(index) {
      this.$refs.previewer.show(index);
    },
  },
  created() {

  }
};
</script>

<style type="text/css">
/*.biaoti{
		font-size:14px;
		color: #303030 !important;
	}
	.neirong{
		font-size:14px;
		color:#999 !important;
	}*/
.weui-cells__title {
  color: #303030 !important;
}
/*.weui-textarea{
		font-size:10px !important;
		border: 1px solid #ccc !important;
		padding:8px;
		width: 90% !important;
		//margin:10px 
	}*/

.vux-cell-value {
  font-weight: 400;
}

/*新的上传控件的样式*/
.file-uploads {
  float: left;
  margin-left: 10px;
  position: relative;
  margin-right: 9px;
  margin-bottom: 9px;
  width: 77px;
  height: 77px;
  border: 1px solid #d9d9d9;
}

.file-uploads:after {
  width: 39.5px;
  height: 2px;
  content: " ";
  position: absolute;
  top: 50%;
  left: 50%;
  -webkit-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
  background-color: #d9d9d9;
}

.file-uploads:before {
  width: 2px;
  height: 39.5px;
  content: " ";
  position: absolute;
  top: 50%;
  left: 50%;
  -webkit-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
  background-color: #d9d9d9;
}

.imglistbox img {
  float: left;
  margin: 6px;
}
</style>
