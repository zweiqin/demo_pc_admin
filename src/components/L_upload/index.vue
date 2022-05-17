<template>
  <div class="L_upload">
		<el-form>
			<el-form-item :label="config.label">
       <el-upload
          class="avatar-uploader"
          :action="url"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
          :headers="uploadHeaders"
          :auto-upload="false"
          :name="config.name"
          :on-change="onChange"
          size="small">
          <i v-if="fileList.length != 0 || config.value" class="avatar-uploader-icon el-icon-folder-checked" />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          <div slot="tip" class="el-upload__tip">注意：只能上传pem文件</div>
        </el-upload>
			</el-form-item>
		</el-form>
  </div>
</template>

<script>
import { getToken } from '@/utils/auth'
export default {
	name:'L_upload',
	props: ["config"],
	data(){
		return{
      fileList: [],
      url: process.env.VUE_APP_BASE_API + '/api/v1/merchant/secretKey/upload/',//上传并非在此组件
      uploadHeaders:{"token":getToken()},
		}
	},
  methods: {
    handleAvatarSuccess(res, file) {
      // this.fileList = URL.createObjectURL(file.raw);
    },
    beforeAvatarUpload(file) {
      // const isPEM = file.type === 'pem';
      // if (!isPEM) {
      //   this.$message.error('上传文件只能是 pem 格式!');
      // }
      // return isPEM;
    },
    onChange(file,fileList) {
      console.log(file,'raw')
      const isPEM = file.name.slice(-3) === 'pem';
      if (!isPEM) {
        return this.$message.error('上传文件只能是 pem 格式!');
      }
      this.config.value = file.raw
      this.$emit('changeValue',this.config.name,file.raw)
      this.$message.success('上传成功！')
    }
  }

}
</script>

<style lang="scss">
.L_upload{
  .avatar-uploader .el-upload {
    border: 1px dashed #999999 ;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
  .el-upload__tip {
    margin-left: 7em;
    color: #999999;
  }
}


 
</style>