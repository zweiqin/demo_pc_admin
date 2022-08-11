<template>
  <div class="menu">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <div class="container">
          <el-form inline size="small" :label-position="labelPosition">
            <el-form-item label="菜单所属">
              <el-select
                v-model="menu_type"
                clearable
                placeholder="请选择"
                class="selWidth"
                @change="getList()"
              >
                <el-option label="总后台" value="0"></el-option>
                <el-option label="服务商" value="1"></el-option>
                <el-option label="商户端" value="2"></el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </div>
        <el-button type="primary" label="default" size="small" @click="addClick">添加菜单</el-button>
      </div>

      <!-- s表格 -->
      <el-table :default-expand-all="true" row-key="menu_id" :data="tableData.data" :tree-props="{children: 'children', hasChildren: 'hasChildren'}" style="width: 100%" size="small" highlight-current-row>

        <el-table-column prop="menu_name" label="菜单名称" min-width="100">
          <template v-slot="scope">
            <span>{{ scope.row.menu_name + '  [ ' + scope.row.menu_id + '  ]' }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="route" label="菜单地址" min-width="100" />

        <el-table-column prop="icon" label="菜单图标" min-width="80">
          <template v-slot="scope">
            <div class="listPic">
              <i :class="'el-icon-' + scope.row.icon" style="font-size: 20px;" />
            </div>
          </template>
        </el-table-column>

        <el-table-column label="菜单归属" min-width="80" fixed="right" align="center">
          <template v-slot="scope">
            <div v-if="scope.row.pid === 0">
              <el-tag v-if="scope.row.menu_type === 0">总后台</el-tag>
              <el-tag v-else-if="scope.row.menu_type === 1" type="success">服务商</el-tag>
              <el-tag v-else type="info">商户端</el-tag>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="是否PC端" min-width="80" fixed="right" align="center">
          <template v-slot="scope">
            <div v-if="scope.row.pid === 0">
              <el-tag v-if="scope.row.is_pc === 1" type="warning">PC端</el-tag>
              <el-tag v-else type="danger">移动端</el-tag>
            </div>
          </template>
        </el-table-column>

        <el-table-column prop="create_time" label="创建时间" min-width="80" />

        <el-table-column label="操作" min-width="120" fixed="right" align="center">
          <template v-slot="scope">
            <el-button type="text" size="small" class="mr10" @click="editClick(scope.row)">编辑</el-button>
            <el-button type="text" size="small" class="mr10" @click="del(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- e表格 -->

    </el-card>

    <!-- s添加菜单 -->
    <el-dialog title="添加菜单" :visible.sync="add_visible" :close-on-click-modal="false" width="50%">

      <el-form ref="addForm" :model="addForm" :rules="addRules">

        <el-form-item label="父级分类" :label-width="formLabelWidth" prop="p_cate">
          <!--<el-cascader :options="options" :props="{ checkStrictly: true }" clearable></el-cascader>-->
          <el-select v-model="addForm.pid" placeholder="请选择父元素">
            <el-option label="根目录" value="0"></el-option>
            <el-option
              v-for="(item) in parent_list"
              :key="item.menu_id"
              :label="item.menu_name"
              :value="item.menu_id"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="是否显示" :label-width="formLabelWidth" prop="is_show">
          <el-switch
            v-model="addForm.is_show"
            class="switch"
            :active-value="1"
            :inactive-value="0"
            active-text="开启"
            inactive-text="关闭"
          />
        </el-form-item>

        <el-form-item label="菜单图标" :label-width="formLabelWidth" prop="icon" class="icon">
          <el-input v-model="addForm.icon" autocomplete="off" clearable>
            <template slot="append">
              <div class="icon-plus" @click="addIcon('add')"><i class="el-icon-circle-plus-outline"></i></div>
            </template>
          </el-input>
        </el-form-item>

        <el-form-item label="菜单名称" :label-width="formLabelWidth" prop="menu_name">
          <el-input v-model="addForm.menu_name" autocomplete="off" placeholder="请输入菜单名称" />
        </el-form-item>

        <el-form-item label="路由" :label-width="formLabelWidth" prop="route">
          <el-input v-model="addForm.route" autocomplete="off" placeholder="请输入路由" />
        </el-form-item>

        <el-form-item label="组件" :label-width="formLabelWidth" prop="component">
          <el-input v-model="addForm.component" autocomplete="off" placeholder="请输入组件" />
        </el-form-item>

        <el-form-item label="是否PC端" :label-width="formLabelWidth" prop="router">
          <el-radio v-model="addForm.is_pc" label="1">是</el-radio>
          <el-radio v-model="addForm.is_pc" label="0">否</el-radio>
        </el-form-item>

        <el-form-item label="菜单归属" :label-width="formLabelWidth" prop="router">
          <el-radio v-model="addForm.menu_type" label="0">总后台</el-radio>
          <el-radio v-model="addForm.menu_type" label="1">服务商</el-radio>
          <el-radio v-model="addForm.menu_type" label="2">商户</el-radio>
        </el-form-item>

        <el-form-item label="备注" :label-width="formLabelWidth" prop="sort">
          <el-input v-model="addForm.remark" type="textarea" placeholder="请输入备注内容" maxlength="250" show-word-limit>
          </el-input>
        </el-form-item>

        <el-form-item label="排序" :label-width="formLabelWidth" prop="sort">
          <el-input-number v-model="addForm.sort" :min="0" :step="1" step-strictly label="排序"></el-input-number>
        </el-form-item>

      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addSubmit('addForm')">确定</el-button>
      </div>
    </el-dialog>
    <!-- e添加菜单 -->

    <!-- s菜单图标 -->
    <el-dialog title="请选择菜单图标" :visible.sync="icon_visible" :close-on-click-modal="false" width="50%">

      <div class="icon-content">
        <!-- <el-input v-model="icon_key" autocomplete="off" placeholder="输入关键词搜索,注意全是英文" style="width: 50%"/> -->
        <div class="icons-container">
          <div class="grid">
            <div v-for="item of elementIcons" :key="item" @click="handleClipboard(generateElementIconCode(item),$event,item)">
              <el-tooltip placement="top">
                <div slot="content">
                  {{ generateElementIconCode(item) }}
                </div>
                <div class="icon-item">
                  <i :class="'el-icon-' + item" />
                  <span>{{ item }}</span>
                </div>
              </el-tooltip>
            </div>
          </div>
        </div>
      </div>

    </el-dialog>
    <!-- e菜单图标 -->

    <!-- s编辑 -->
    <el-dialog title="编辑菜单" :visible.sync="edit_visible" :close-on-click-modal="false" width="50%">

      <el-form ref="editForm" :model="editForm" :rules="editRules">

        <el-form-item label="父级分类" :label-width="formLabelWidth" prop="p_cate">
          <el-select v-model="editForm.pid" placeholder="请选择父元素">
            <el-option label="根目录" value="0"></el-option>
            <el-option
              v-for="(item) in parent_list"
              :key="item.menu_id"
              :label="item.menu_name"
              :value="item.menu_id"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="是否显示" :label-width="formLabelWidth" prop="is_show">
          <el-switch
            v-model="editForm.is_show"
            class="switch"
            :active-value="1"
            :inactive-value="0"
            active-text="开启"
            inactive-text="关闭"
          />
        </el-form-item>

        <el-form-item label="菜单图标" :label-width="formLabelWidth" prop="icon" class="icon">
          <el-input v-model="editForm.icon" autocomplete="off" clearable>
            <template slot="append">
              <div class="icon-plus" @click="addIcon('edit')"><i class="el-icon-circle-plus-outline"></i></div>
            </template>
          </el-input>
        </el-form-item>

        <el-form-item label="菜单名称" :label-width="formLabelWidth" prop="menu_name">
          <el-input v-model="editForm.menu_name" autocomplete="off" placeholder="请输入菜单名称" />
        </el-form-item>

        <el-form-item label="路由" :label-width="formLabelWidth" prop="route">
          <el-input v-model="editForm.route" autocomplete="off" placeholder="请输入路由" />
        </el-form-item>

        <el-form-item label="组件" :label-width="formLabelWidth" prop="component">
          <el-input v-model="editForm.component" autocomplete="off" placeholder="请输入组件" />
        </el-form-item>

        <el-form-item label="是否PC端" :label-width="formLabelWidth" prop="is_pc">
          <el-radio v-model="editForm.is_pc" label="1">是</el-radio>
          <el-radio v-model="editForm.is_pc" label="0">否</el-radio>
        </el-form-item>

        <el-form-item label="菜单归属" :label-width="formLabelWidth" prop="is_mer">
          <el-radio v-model="editForm.menu_type" label="0">总后台</el-radio>
          <el-radio v-model="editForm.menu_type" label="1">服务商</el-radio>
          <el-radio v-model="editForm.menu_type" label="2">商户</el-radio>
        </el-form-item>

        <el-form-item label="备注" :label-width="formLabelWidth" prop="remark">
          <el-input v-model="editForm.remark" type="textarea" placeholder="请输入备注内容" maxlength="250" show-word-limit>
          </el-input>
        </el-form-item>

        <el-form-item label="排序" :label-width="formLabelWidth" prop="sort">
          <el-input-number v-model="editForm.sort" :min="0" :step="1" step-strictly label="排序"></el-input-number>
        </el-form-item>

      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="editSubmit('editForm')">确定</el-button>
      </div>
    </el-dialog>
    <!-- e编辑 -->
  </div>
</template>

<script>
import svgIcons from './svg-icons'
import elementIcons from './element-icons'
import { OperateMenu, GetMenuList, DelMenu } from '@/api/system_menu'

export default {
  name: 'menus',
  data() {
    return {
      menu_type: '',
      parent_list: [],
      formLabelWidth: '120px',
      tableData: {
        data: [{
          icon: 'eleme',
          menu_name: '一级菜单',
          menu_id: 11,
          children: [{
            icon: 'eleme',
            menu_name: '一级菜单',
            menu_id: 12
          }]
        }],
        total: 0
      },

      pro_num: 10,
      sel_pro_num: 2,
      labelPosition: 'right',
      menuForm: {
        page: 1,
        limit: 10,
        sort: ''
      },
      unifiedData: [{
        name_num: '123'
      }],
      // s新增
      add_visible: false,
      addForm: {
        pid: '0',
        route: '',
        icon: '',
        menu_name: '',
        component: '',
        sort: 1,
        is_show: 1,
        is_pc: '1',
        menu_type: '0',
        is_menu: 1,
        remark: ''
      },
      addRules: {
        menu_name: [{ required: true, message: '请输入菜单名称', change: 'blue' }]
      },
      options: [],
      // e新增

      // 菜单图标
      add_edit: 'add', // add表示添加菜单打开的，edit表示编辑打开的
      icon_visible: false,
      // icon_key: '',
      svgIcons,
      elementIcons,

      // s新增
      edit_visible: false,
      editForm: {
        menu_id: 0,
        pid: '0',
        route: '',
        icon: '',
        menu_name: '',
        component: '',
        sort: 1,
        is_show: 1,
        is_pc: '1',
        menu_type: '0',
        is_menu: 1,
        remark: ''
      },
      editRules: {
        menu_name: [{ required: true, message: '请输入菜单名称', change: 'blue' }]
      }
      // e新增
    }
  },
  mounted() {
    this.getList()
    this.getAllParentList()
  },
  methods: {
    getAllParentList() {
      GetMenuList({ menu_type: this.menu_type, pid: 0 })
        .then(res => {
          this.parent_list = res.data
        })
        .catch(err => {
          this.$message.error(err.data.msg)
        })
    },
    // 列表
    getList() {
      GetMenuList({ menu_type: this.menu_type })
        .then(res => {
          this.tableData.data = res.data
        })
        .catch(err => {
          this.$message.error(err.data.msg)
        })
    },
    // 分页
    page_change(page) {
      this.menuForm.page = page
      this.getList('')
    },
    handle_size_change(val) {
      this.menuForm.limit = val
      this.getList('')
    },

    // s添加菜单
    addClick() {
      this.add_visible = true
      this.$nextTick(function () {
        this.$refs['addForm'].resetFields()
      })
    },
    // 确定
    addSubmit(formName) {
      this.$refs[formName].validate(async valid => {
        // 若必填项不为空
        if (valid) {
          OperateMenu(this.addForm)
            .then(() => {
              this.$message.success('添加成功')
              this.getList()
              this.getAllParentList()
              this.add_visible = false
            })
            .catch(err => {
              this.$message.error(err.data.msg)
            })
        } else {
          return false
        }
      })
    },
    // e添加菜单

    // s添加菜单--选择图标
    addIcon(e) {
      this.add_edit = e
      this.icon_visible = true
    },
    generateElementIconCode(symbol) {
      return `<i class="el-icon-${symbol}" />`
    },
    handleClipboard(text, event, item) {
      // clipboard(text, event)
      if (this.add_edit === 'add') { // 添加菜单打开
        this.addForm.icon = item
      } else if (this.add_edit === 'edit') { // 编辑打开
        this.editForm.icon = item
      }
      this.icon_visible = false
    },
    // e添加菜单--选择图标

    // 编辑
    editClick(e) {
      this.editForm.menu_id = e.menu_id
      if (e.pid === 0) {
        this.editForm.pid = e.pid.toString()
      } else {
        this.editForm.pid = e.pid
      }
      this.editForm.is_show = e.is_show
      this.editForm.icon = e.icon
      this.editForm.menu_name = e.menu_name
      this.editForm.route = e.route
      this.editForm.is_pc = e.is_pc.toString()
      this.editForm.menu_type = e.menu_type.toString()
      this.editForm.remark = e.remark
      this.editForm.sort = e.sort
      this.edit_visible = true
    },
    // 编辑--保存
    editSubmit(formName) {
      this.$refs[formName].validate(async valid => {
        // 若必填项不为空
        if (valid) {
          OperateMenu(this.editForm)
            .then(() => {
              this.$message.success('编辑成功')
              this.getList()
              this.getAllParentList()
              this.edit_visible = false
            })
            .catch(err => {
              this.$message.error(err.data.msg)
            })
        } else {
          return false
        }
      })
    },
    // 删除
    del(e) {
      this.$confirm('删除后无法恢复，确认删除?', '确认删除', {
        confirmButtonText: '确认删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // console.log(e)
        DelMenu({ menu_id: e.menu_id })
          .then(() => {
            this.$message.success('删除成功！')
            this.getList()
            this.getAllParentList()
          })
          .catch(err => {
            this.$message.error(err.data.msg)
          })
      }).catch(() => {})
    }
  }
}
</script>

<style lang="scss" scoped>
.menu{
  .box-card {
    margin: 20px 20px
  }

  .container {
    min-width: 821px;
    margin-bottom: 20px;
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
  .listPic{
    .image-slot{
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
}
/* switch按钮样式 */
::v-deep .switch .el-switch__label {
  position: absolute;
  display: none;
  color: #fff !important;
}
/*打开时文字位置设置*/
::v-deep .switch .el-switch__label--right {
  z-index: 1;
}
/* 调整打开时文字的显示位子 */
::v-deep .switch .el-switch__label--right span{
  margin-left: 9px;
}
/*关闭时文字位置设置*/
::v-deep .switch .el-switch__label--left {
  z-index: 1;
}
/* 调整关闭时文字的显示位子 */
::v-deep .switch .el-switch__label--left span{
  margin-left: 21px;
}
/*显示文字*/
::v-deep .switch .el-switch__label.is-active {
  display: block;
}
/* 调整按钮的宽度 */
::v-deep .switch.el-switch .el-switch__core,
::v-deep .el-switch .el-switch__label {
  width: 60px !important;
  margin: 0;
}
.icon{
  ::v-deep .el-input-group__append{
    cursor: pointer !important;
    padding: 0;
    width: 50px;
    text-align: center;
  }
}
.icon-content{
  height: 500px;
  overflow-y: scroll;
}
.icons-container {
  margin: 10px 20px 0;
  overflow: hidden;

  .grid {
    position: relative;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  }

  .icon-item {
    margin: 20px;
    height: 85px;
    text-align: center;
    width: 100px;
    float: left;
    font-size: 30px;
    color: #24292e;
    cursor: pointer;
  }

  span {
    display: block;
    font-size: 16px;
    margin-top: 10px;
  }

  .disabled {
    pointer-events: none;
  }
}
</style>
