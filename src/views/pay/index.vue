<template>
  <!-- 转账配置  -->
  <div class="transfer-config">

    <el-card>
      <el-tabs v-model="activeName" :key="index" v-for="(item, index) in allPayType" type="card" @tab-click="handleClick">
        <el-tab-pane :label="item.pay_name" :name="item.pay_name"></el-tab-pane>
      </el-tabs>
      <h3>配置信息</h3>

      <!-- s添加的组件 -->
      <div v-for="(item) in items" :key="item.name" class="item">
        <component :is="item.component" :config="item.config"  @changeValue="changeKeyValue"></component>
      </div>
      <!-- e添加的组件 -->

      <div style="margin-bottom: 100px;">
        <el-radio v-model="status" label="0">禁用</el-radio>
        <el-radio v-model="status" label="1">启用</el-radio>
      </div>

      <el-button @click="submit" type="primary" class="submit-btn">确认修改</el-button>
    </el-card>

  </div>

</template>

<script>
import L_input from '@/components/L_input'
import L_upload from '@/components/L_upload'
import { getPayType, newPayType, uploadKey } from '@/api/config'
export default {
  name:'index',
  components: {
    L_input,
    L_upload
  },
  data() {
    return {
      activeName: '支付宝',
      allPayType: [],//系统所有可选择的支付配置
      merPayType: [],//商户所有已配置的支付配置
      nowPayType: {},//商户当前页面展现的某一支付方式的支付配置信息
      ifNowPay: false,//当前这个支付方式是否已配置过
      items:[],//组件信息数组
      status:0,
      verifyShow: false,
      formLabelWidth: "120",
      verifyForm: {
        operate_pwd: '',
      },
      verifyRules: {
        operate_pwd: [{ required: true, message: '操作密码不能为空', change: 'blue' }],
      }
    }
  },

  async created() {
    //默认支付方式第一个排序就是支付宝
    await this.getPayType()
    let tab = { name:'支付宝',index:'0' }
    this.handleClick(tab)
  },
  methods: {
    //更改密钥
    changeKeyValue(name,value) {
      this.items.forEach(item =>{
        if(item.config.name == name) {
          item.config.value = value
        }
      })
    },

    //获取系统所有的支付配置信息
    async getPayType() {
      await getPayType().then(res =>{
        this.allPayType = res.data
      }).catch(err =>{
        this.$message.error(err.data.data)
      })
    },

    handleClick(tab) {
      this.activeName = tab.name
      this.items = []
      if(this.allPayType) {
        this.allPayType.forEach(item =>{
          if(item.pay_name == tab.name) {
            if(item.value != ''){
              this.generateComponent(item.value)
            }else{
              this.generateComponent(item.config)
            }
            this.nowPayType = JSON.parse(JSON.stringify(item))
            this.status = item.status.toString()
          }
        })
      }
    },


    //对接口返回的组件等格式修改为适合生成组件的格式(目前只有两种组件  input和file)
    generateComponent(e) {
      this.items = []
      e.forEach(item =>{
        if(item.type == 'input') {
          this.items.push({ component:L_input, config:item })
        }else {
          this.items.push({ component:L_upload, config:item })
        }
      })
    },

    //先上传公钥私钥(同时上传),取到返回值（路径）之后对组件的config.value重新赋值再修改支付配置（做一步判断，如果公私钥并没有变化，不对公私钥重新上传）
    submit() {
      let update_file = []
      let update_data  = {}
      update_data.s_p_id = this.nowPayType.s_p_id
      update_data.status = this.status

      //先取出公私钥的值
      var form = new FormData();
      form.append('type', this.nowPayType.s_p_id);

      this.items.forEach(item => {
        if(item.config.type == 'file' && typeof(item.config.value) == "object"){
          update_file.push(item.config.name)
          form.append(item.config.name, item.config.value);
        }
      })

      if(update_file.length == 0) {
        let no_change_data = this.items.map(item => {
          return item.config
        })
        update_data.value = no_change_data
        this.uploadPayType(update_data)
      }else {
        let array_data = []
        // 上传密钥成功之后回填路径参数，之后请求提交函数
        uploadKey(form).then(res =>{
          const data = res.data
          this.items.forEach(item => {
            if(item.config.type == 'file' && typeof(item.config.value) == "object"){
              let target_data = {}
              target_data = JSON.parse(JSON.stringify(item.config))
              target_data.value = data.[item.config.name+'_url']
              array_data.push(target_data)
            }else{
              array_data.push(JSON.parse(JSON.stringify(item.config)))
            }
          })
          update_data.value = array_data
          this.uploadPayType(update_data)
        }).catch(err =>{
          this.$message.error(err.data.data)
        })
      }
    },

    //提交修改支付配置
    uploadPayType(update_data){
      newPayType(update_data).then(res =>{
        this.$message.success('修改配置成功！')
      }).catch(err => {
        this.$message.error(err.data)
      })
    }
  },
}
</script>

<style lang="scss" scoped>
.transfer-config{
  padding: 1em;
  .submit-btn {
    margin-left: 7em;
  }
}
</style>
