<template>
  <div class="shop">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <!-- s搜索区 -->
        <div class="container">
          <el-form inline size="small" :label-position="labelPosition">

            <el-form-item label="商户名称：" style="display:inline-block">
              <el-input v-model="shopForm.search" placeholder="请输入商户名称" clearable />
            </el-form-item>

            <el-form-item label="状态">
              <el-select
                v-model="shopForm.status"
                clearable
                placeholder="请选择"
                class="selWidth"
                @change="get_list(1)"
              >
                <el-option label="启用" value="1"></el-option>
                <el-option label="禁用" value="0"></el-option>
              </el-select>
            </el-form-item>

            <el-button class="ResetSearch mr10" size="small" type="reset" @click="reset('shopForm')">重置</el-button>
            <el-button type="primary" label="default" size="small" @click="shop_search">查询</el-button>
          </el-form>
        </div>
        <!-- e搜索区 -->
      </div>

      <el-button type="primary" label="default" size="small" @click="add_click">新增商户</el-button>

      <!-- s表格 -->
      <el-table :data="tableData.data" style="width: 100%" size="small" highlight-current-row>

        <el-table-column prop="mer_name" label="商户名称" min-width="100" />

        <el-table-column prop="mer_phone" label="商户联系电话" min-width="100" />

        <el-table-column prop="mer_admin_phone" label="管理员联系电话" min-width="100" />

        <el-table-column prop="license" label="营业执照" min-width="100" />

        <el-table-column prop="mer_address" label="商户地址" min-width="100" />

        <el-table-column prop="remark" label="备注" min-width="100">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="light" :content="scope.row.remark" placement="top">
              <el-button type="text">{{ scope.row.remark.slice(0,5) }}...</el-button>
            </el-tooltip>
          </template>
        </el-table-column>

        <el-table-column label="状态" min-width="100">
          <template slot-scope="scope">
            <el-tag type="info" v-if="scope.row.status == 0">禁用</el-tag>
            <el-tag type="success" v-else>启用</el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="create_time" label="创建时间" min-width="140"/>

        <el-table-column label="操作" min-width="120" fixed="right" align="center">
          <template slot-scope="scope">
            <el-button type="text" size="small" class="mr10" @click="edit(scope.row)">编辑</el-button>
            <el-button v-if="scope.row.status == 1" type="text" size="small" class="mr10" @click="change_status(scope.row.mer_id,0)">禁用</el-button>
            <el-button v-else type="text" size="small" class="mr10" @click="change_status(scope.row.mer_id,1)">启用</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="block">
        <el-pagination
          :page-sizes="[10, 20, 40, 60, 80]"
          :page-size="shopForm.limit"
          :current-page="shopForm.page"
          layout="total, sizes, prev, pager, next, jumper"
          :total="tableData.total"
          @size-change="handle_size_change"
          @current-change="page_change"
        />
      </div>
      <!-- e表格 -->
    </el-card>
    <!-- s新增 -->
    <el-dialog title="新增商户信息" :visible.sync="add_visible" :close-on-click-modal="false" class="edit" width="50%">

      <el-form ref="addForm" :model="addForm" :rules="addRules">

        <el-form-item label="商户名称：" :label-width="formLabelWidth" prop="mer_name">
          <el-input v-model="addForm.mer_name" autocomplete="off" placeholder="请输入门店名称" />
        </el-form-item>

        <el-form-item label="商户地址：" :label-width="formLabelWidth" prop="mer_address">
          <el-input v-model="addForm.mer_address" autocomplete="off" placeholder="请输入门店地址" />
        </el-form-item>

        <el-form-item label="商户联系电话：" :label-width="formLabelWidth" prop="mer_phone">
          <el-input v-model="addForm.mer_phone" autocomplete="off" placeholder="请输入门店联系电话" />
        </el-form-item>

        <el-form-item label="管理员电话：" :label-width="formLabelWidth" prop="mer_admin_phone">
          <el-input v-model="addForm.mer_admin_phone" autocomplete="off" placeholder="请输入管理员电话(登录使用)" />
        </el-form-item>

        <el-form-item label="营业执照：" :label-width="formLabelWidth" prop="license">
          <el-input v-model="addForm.license" autocomplete="off" placeholder="请输入营业执照" />
        </el-form-item>

        <el-form-item label="商户备注：" :label-width="formLabelWidth">
          <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 6}" placeholder="请输入备注" v-model="addForm.remark" maxlength="200" show-word-limit />
        </el-form-item>

      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="add_submit('addForm')">确定</el-button>
      </div>
    </el-dialog>
    <!-- e新增 -->

    <!-- s编辑 -->
    <el-dialog title="编辑商户信息" :visible.sync="edit_visible" :close-on-click-modal="false" class="edit" width="50%">

      <el-form ref="editForm" :model="editForm" :rules="editRules">

        <el-form-item label="商户名称：" :label-width="formLabelWidth" prop="mer_name">
          <el-input v-model="editForm.mer_name" autocomplete="off" placeholder="请输入门店名称" />
        </el-form-item>

        <el-form-item label="商户地址：" :label-width="formLabelWidth" prop="mer_address">
          <el-input v-model="editForm.mer_address" autocomplete="off" placeholder="请输入门店地址" />
        </el-form-item>

        <el-form-item label="商户联系电话：" :label-width="formLabelWidth" prop="mer_phone">
          <el-input v-model="editForm.mer_phone" autocomplete="off" placeholder="请输入门店联系电话" />
        </el-form-item>

        <el-form-item label="营业执照：" :label-width="formLabelWidth" prop="license">
          <el-input v-model="editForm.license" autocomplete="off" placeholder="请输入营业执照" />
        </el-form-item>

        <el-form-item label="商户备注：" :label-width="formLabelWidth">
          <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 6}" placeholder="请输入备注" v-model="editForm.remark" maxlength="200" show-word-limit />
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="edit_submit('editForm')">确定</el-button>
      </div>
    </el-dialog>
    <!-- e编辑 -->
  </div>
</template>

<script>
var reg_phone = /^1(3[0-9]|4[01456879]|5[0-35-9]|6[2567]|7[0-8]|8[0-9]|9[0-35-9])\d{8}$/

import {mer_search, mer_operate, mer_enabled} from '@/api/merchant'

export default {
  name: 'shop',
  data() {
    return {
      formLabelWidth: '120px',
      tableData: {
        data: [],
        total: 0
      },
      labelPosition: 'right',
      shopForm: {
        page: 1,
        limit: 10,
        status:'',
        search: ''
      },
      // 新增
      add_visible: false,
      addForm: {
        mer_name: '',
        mer_phone: '',
        mer_admin_phone:'',
        mer_address: '',
        remark:'',
        license:''
      },
      addRules: {
        mer_name: [{ required: true, message: '商户名称不能为空', change: 'blue' }],
        mer_admin_phone: [{ required: true, message: '管理员电话(登录使用)不能为空', change: 'blue' }],
        mer_address: [{ required: true, message: '商户地址不能为空', change: 'blue' }],
        license: [{ required: true, message: '营业执照不能为空', change: 'blue' }],
      },
      // 编辑
      edit_visible: false,
      editForm: {
        mer_id: '',
        mer_name: '',
        mer_phone: '',
        mer_admin_phone:'',
        mer_address: '',
        remark:'',
        license:''
      },
      editRules: {
        mer_name: [{ required: true, message: '门店名称不能为空', change: 'blue' }],
        real_name: [{ required: true, message: '门店负责人不能为空', change: 'blue' }],
        mer_address: [{ required: true, message: '门店地址不能为空', change: 'blue' }],
        license: [{ required: true, message: '营业执照不能为空', change: 'blue' }],
      }
    }
  },
  mounted() {
    this.get_list('')
  },
  methods: {
    //更改状态
    change_status(mer_id,type){
      let msg = ''
      let response_msg = ''
      if(type == 1 ){
        msg = '是否确定禁用该商户？'
        response_msg = '禁用成功'
      }else{
        msg = '是否确定启用该商户？'
        response_msg = '启用成功'
      }
      this.$confirm(msg, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        mer_enabled({mer_id:mer_id,status:type})
          .then(res => {
            this.$message.success(response_msg)
            this.get_list()
          })
          .catch(err => {
            this.$message.error(err.data.data)
          })
      }).catch(() => {});
    },
    shop_search() {
      this.get_list(1)
    },
    // 列表
    get_list(num) {
      this.shopForm.page = num || this.shopForm.page
      const param = this.shopForm
      mer_search(param)
        .then(res => {
          this.tableData.data = res.data.items
          this.tableData.total = res.data.total
        })
        .catch(err => {
          this.$message.error(err.data.data)
        })
    },
    page_change(page) {
      this.shopForm.page = page
      this.get_list('')
    },
    handle_size_change(val) {
      this.shopForm.limit = val
      this.get_list('')
    },
    // 重置
    reset() {
      this.shopForm = {
        page: 1,
        limit: 10,
        status:'',
        search: ''
      }
      this.get_list('')
    },
    // 新增
    add_click() {
      this.add_visible = true
      this.$nextTick(function () {
        this.$refs['addForm'].resetFields()
      })
    },
    // 新增--确认
    add_submit(formName) {
      this.$refs[formName].validate(async valid => {
        // 若必填项不为空
        if (valid) {
          if(!reg_phone.test(this.addForm.mer_phone)){
            this.$message.error("联系电话格式不正确")
          }else {
            mer_operate(this.addForm)
              .then(res => {
                this.$message.success("新增成功")
                this.get_list('')
                this.add_visible = false
              })
              .catch(err => {
                this.$message.error(err.data.data)
              })
          }
        } else {
          return false
        }
      })
    },
    // 编辑
    edit(e) {
      this.editForm.mer_name = e.mer_name
      this.editForm.mer_id = e.mer_id
      this.editForm.mer_phone = e.mer_phone
      this.editForm.mer_admin_phone = e.mer_admin_phone
      this.editForm.mer_address = e.mer_address
      this.editForm.commission_rate = e.commission_rate
      this.editForm.remark = e.remark
      this.editForm.license = e.license
      this.edit_visible = true
    },
    // 编辑--确认
    edit_submit(formName) {
      this.$refs[formName].validate(async valid => {
        // 若必填项不为空
        if (valid) {
          if(!reg_phone.test(this.editForm.mer_phone)){
            this.$message.error("联系电话格式不正确")
          }else {
            mer_operate(this.editForm)
              .then(res => {
                this.$message.success("修改成功")
                this.get_list('')
                this.edit_visible = false
              })
              .catch(err => {
                this.$message.error(err.data.data)
              })
          }
        } else {
          return false
        }
      })
    },
  }
}
</script>

<style lang="scss">
::deep [type=reset],
[type=submit],
button,
html [type=button] {
  -webkit-appearance: none !important;
}
.shop{
  .box-card {
    margin: 20px 20px
  }

  .container {
    min-width: 821px;
  }

  .block{
    float: right;
  }
  .demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }
}

</style>
