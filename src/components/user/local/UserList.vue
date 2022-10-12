<template>
  <div>
    <div class="table">
      <el-table
        v-loading="info.list.loading"
        element-loading-text="加载中..."
        element-loading-spinner="el-icon-loading"
        :data="info.list.items"
        :border="true"
        :max-height="tableHeight"
        size="small"
        :stripe="true">
        <el-table-column type="index" label="序号" />
        <el-table-column label="账号" prop="account" />
        <el-table-column label="姓名" prop="name" />
        <el-table-column width="175px">
          <template #header>
            <el-button type="text" size="small" icon="el-icon-refresh" :loading="info.list.loading" @click="doGetList" >
              <span>刷新</span>
            </el-button>
            <el-button type="text" size="small" icon="el-icon-circle-plus-outline" :disabled="builtIn === false" @click="showAdd" >
              <span>添加</span>
            </el-button>
          </template>
          <template slot-scope="scope">
            <el-button type="text" size="small" icon="el-icon-edit-outline" :disabled="!(scope.row.account.toLowerCase() === info.account || builtIn)" @click="showMod(scope.row)">
              <span>修改</span>
            </el-button>
            <template v-if="builtIn">
              <el-button v-if="scope.row.account.toLowerCase() == info.account" type="text" size="small" icon="el-icon-edit"  @click="showChangePassword(scope.row)">
                <span>密码</span>
              </el-button>
              <el-button v-else type="text" size="small" icon="el-icon-refresh-right" @click="showResetPassword(scope.row)" >
                <span>密码</span>
              </el-button>
            </template>
            <template v-else>
              <el-button type="text" size="small" icon="el-icon-edit" :disabled="scope.row.account.toLowerCase() !== info.account" @click="showChangePassword(scope.row)">
                <span>密码</span>
              </el-button>
            </template>
            <el-popconfirm style="margin-left: 10px;"
                           :title="'确定删除帐号【' + scope.row.account + '】吗？'"
                           @confirm="doDelete(scope.row.account)">
              <el-button slot="reference"
                         type="text"
                         size="small"
                         icon="el-icon-delete"
                         :disabled="scope.row.builtIn || builtIn === false" >
                <span>删除</span>
              </el-button>
            </el-popconfirm>

          </template>
        </el-table-column>
        <template slot="empty">
          <el-alert v-if="isNotNullOrEmpty(info.list.error.summary)" type="error" :closable="false" :title="info.list.error.summary" :description="info.list.error.detail" />
          <span v-else></span>
        </template>
      </el-table>
    </div>

    <div>
      <drawer v-model="info.add.visible"
              key="add"
              title="添加用户"
              icon="el-icon-circle-plus-outline"
              size="540px"
              :modal="true">
        <div style="padding: 20px 20px 0px 20px;">
          <el-form label-width="auto" label-position="left" label-suffix=":">
            <el-form-item label="帐号" :required="true">
              <el-input v-model="info.add.args.account" placeholder="登录帐号" :clearable="true" @input="onAddInput"/>
            </el-form-item>
            <el-form-item label="密码" :required="true">
              <el-input v-model="info.add.args.password" placeholder="登录密码" :show-password="true" @input="onAddInput"/>
            </el-form-item>
            <el-form-item label="姓名" :required="false">
              <el-input v-model="info.add.args.name" placeholder="用户姓名" :clearable="true" @input="onAddInput"/>
            </el-form-item>
          </el-form>
        </div>
        <div v-show="info.add.error.code !== 0" style="padding: 0px 0px 15px 0px;">
          <errorMessage :code="info.add.error.code" :summary="info.add.error.summary" :detail="info.add.error.detail" />
        </div>
        <div style="padding: 5px 20px; text-align: right;">
          <el-button :disabled="info.add.submitting" @click="info.add.visible = false" >取 消</el-button>
          <el-button type="primary" :disabled="info.add.disable" :loading="info.add.submitting" @click="doAdd">提 交</el-button>
        </div>
      </drawer>

      <drawer v-model="info.mod.visible"
              key="mod"
              title="修改用户信息"
              icon="el-icon-edit-outline"
              size="540px"
              :modal="true">
        <div style="padding: 20px 20px 0px 20px;">
          <el-form label-width="auto" label-position="left" label-suffix=":">
            <el-form-item label="帐号" :required="true">
              <el-input v-model="info.mod.args.account" placeholder="登录帐号" :disabled="true"/>
            </el-form-item>
            <el-form-item label="姓名" :required="false">
              <el-input v-model="info.mod.args.name" placeholder="用户姓名" :clearable="true" @input="onModInput"/>
            </el-form-item>
          </el-form>
        </div>
        <div v-show="info.mod.error.code !== 0" style="padding: 0px 0px 15px 0px;">
          <errorMessage :code="info.mod.error.code" :summary="info.mod.error.summary" :detail="info.mod.error.detail" />
        </div>
        <div style="padding: 5px 20px; text-align: right;">
          <el-button :disabled="info.mod.submitting" @click="info.mod.visible = false" >取 消</el-button>
          <el-button type="primary" :disabled="info.mod.disable" :loading="info.mod.submitting" @click="doMod">提 交</el-button>
        </div>
      </drawer>

      <drawer v-model="info.resetPassword.visible"
              key="reset-password"
              title="重置密码"
              icon="el-icon-refresh-right"
              size="540px"
              :modal="true">
        <div style="padding: 20px 20px 0px 20px;">
          <el-form label-width="auto" label-position="left" label-suffix=":">
            <el-form-item label="帐号">
              <el-input v-model="info.resetPassword.args.account" :disabled="true"/>
            </el-form-item>
            <el-form-item label="姓名" :required="false">
              <el-input v-model="info.resetPassword.confirm.name" :disabled="true"/>
            </el-form-item>
            <el-form-item label="密码" :required="true">
              <el-input v-model="info.resetPassword.args.password" placeholder="新密码" :show-password="true" @input="onResetPasswordInput"/>
            </el-form-item>
            <el-form-item label="密码确认" :required="true">
              <el-input v-model="info.resetPassword.confirm.password" placeholder="新密码" :show-password="true" @input="onResetPasswordInput"/>
            </el-form-item>
          </el-form>
        </div>
        <div v-show="info.resetPassword.error.code !== 0" style="padding: 0px 0px 15px 0px;">
          <errorMessage :code="info.resetPassword.error.code" :summary="info.resetPassword.error.summary" :detail="info.resetPassword.error.detail" />
        </div>
        <div style="padding: 5px 20px; text-align: right;">
          <el-button :disabled="info.resetPassword.submitting" @click="info.resetPassword.visible = false" >取 消</el-button>
          <el-button type="primary" :disabled="info.resetPassword.disable" :loading="info.resetPassword.submitting" @click="doResetPassword">提 交</el-button>
        </div>
      </drawer>

      <drawer v-model="info.changePassword.visible"
              key="change-password"
              title="修改密码"
              icon="el-icon-edit"
              size="540px"
              :modal="true">
        <div style="padding: 20px 20px 0px 20px;">
          <el-form label-width="auto" label-position="left" label-suffix=":">
            <el-form-item label="帐号">
              <el-input v-model="info.changePassword.args.account" :disabled="true"/>
            </el-form-item>
            <el-form-item label="姓名" :required="false">
              <el-input v-model="info.changePassword.confirm.name" :disabled="true"/>
            </el-form-item>
            <el-form-item label="原密码" :required="true">
              <el-input v-model="info.changePassword.args.oldPassword" placeholder="原密码" :show-password="true" @input="onChangePasswordInput"/>
            </el-form-item>
            <el-form-item label="新密码" :required="true">
              <el-input v-model="info.changePassword.args.newPassword" placeholder="新密码" :show-password="true" @input="onChangePasswordInput"/>
            </el-form-item>
            <el-form-item label="新密码确认" :required="true">
              <el-input v-model="info.changePassword.confirm.newPassword" placeholder="新密码" :show-password="true" @input="onChangePasswordInput"/>
            </el-form-item>
          </el-form>
        </div>
        <div v-show="info.changePassword.error.code !== 0" style="padding: 0px 0px 15px 0px;">
          <errorMessage :code="info.changePassword.error.code" :summary="info.changePassword.error.summary" :detail="info.changePassword.error.detail" />
        </div>
        <div style="padding: 5px 20px; text-align: right;">
          <el-button :disabled="info.changePassword.submitting" @click="info.changePassword.visible = false" >取 消</el-button>
          <el-button type="primary" :disabled="info.changePassword.disable" :loading="info.changePassword.submitting" @click="doChangePassword">提 交</el-button>
        </div>
      </drawer>
    </div>
  </div>
</template>

<script>
import Component from 'vue-class-component'
import SocketBase from '@/components/SocketBase'
import Drawer from '@/components/Drawer'
import ErrorMessage from '@/components/Error'

@Component({
  components: {
    drawer: Drawer,
    errorMessage: ErrorMessage
  }
})
class UserList extends SocketBase {
  tableHeight = this.getBodyHeight()
  info = {
    account: '',
    list: {
      loading: false,
      items: [
      //  {
      //    account: "admin",
      //    name: "管理员",
      //    builtIn: true
      //  }
      ],
      error: {
        summary: '',
        detail: ''
      }
    },
    add: {
      visible: false,
      submitting: false,
      disable: true,
      args: {
        account: '',
        name: '',
        password: ''
      },
      error: {
        code: 0,
        summary: '',
        detail: ''
      }
    },
    mod: {
      visible: false,
      submitting: false,
      disable: true,
      args: {
        account: '',
        name: ''
      },
      old: {
        name: ''
      },
      error: {
        code: 0,
        summary: '',
        detail: ''
      }
    },
    resetPassword: {
      visible: false,
      submitting: false,
      disable: true,
      args: {
        account: '',
        password: ''
      },
      confirm: {
        password: '',
        name: ''
      },
      error: {
        code: 0,
        summary: '',
        detail: ''
      }
    },
    changePassword: {
      visible: false,
      submitting: false,
      disable: true,
      args: {
        account: '',
        oldPassword: '',
        newPassword: ''
      },
      confirm: {
        newPassword: '',
        name: ''
      },
      error: {
        code: 0,
        summary: '',
        detail: ''
      }
    }
  }

  get builtIn () {
    if (this.info.account === 'admin') {
      return true
    } else {
      return false
    }
  }

  onElementHeightChanged(v) {
    this.tableHeight = v
  }

  showAdd() {
    this.info.add.args.account = ''
    this.info.add.args.name = ''
    this.info.add.args.password = ''
    this.info.add.error.code = 0
    this.info.add.error.summary = ''
    this.info.add.error.detail = ''
    this.info.add.submitting = false
    this.info.add.disable = true
    this.info.add.visible = true
  }

  onAddInput() {
    this.info.add.error.code = 0
    this.info.add.error.summary = ''
    this.info.add.error.detail = ''

    if (this.isNullOrEmpty(this.info.add.args.account) || this.isNullOrEmpty(this.info.add.args.password)) {
      this.info.add.disable = true
    } else {
      this.info.add.disable = false
    }
  }

  onAdd (code, err, data) {
    this.info.add.submitting = false
    this.info.add.error.code = code

    if (code === 0) {
      this.info.add.visible = false
      this.doGetList()
    } else {
      this.info.add.error.summary = err.summary
      this.info.add.error.detail = err.detail
    }
  }

  doAdd () {
    if (this.info.add.submitting) {
      return
    }

    this.info.add.error.code = 0
    this.info.add.error.summary = ''
    this.info.add.error.detail = ''
    this.info.add.submitting = true
    this.post(this.$uris.createLocalUser, this.info.add.args, this.onAdd)
  }

  showMod(row) {
    this.info.mod.args.account = row.account
    this.info.mod.args.name = row.name
    this.info.mod.old.name = row.name
    this.info.mod.error.code = 0
    this.info.mod.error.summary = ''
    this.info.mod.error.detail = ''
    this.info.mod.submitting = false
    this.info.mod.disable = true
    this.info.mod.visible = true
  }

  onModInput() {
    this.info.mod.error.code = 0
    this.info.mod.error.summary = ''
    this.info.mod.error.detail = ''

    if (this.info.mod.args.name === this.info.mod.old.name) {
      this.info.mod.disable = true
    } else {
      this.info.mod.disable = false
    }
  }

  onMod (code, err, data) {
    this.info.mod.submitting = false
    this.info.mod.error.code = code

    if (code === 0) {
      this.info.mod.visible = false
      this.doGetList()
    } else {
      this.info.mod.error.summary = err.summary
      this.info.mod.error.detail = err.detail
    }
  }

  doMod () {
    if (this.info.mod.submitting) {
      return
    }

    this.info.mod.error.code = 0
    this.info.mod.error.summary = ''
    this.info.mod.error.detail = ''
    this.info.mod.submitting = true
    this.post(this.$uris.modifyLocalUser, this.info.mod.args, this.onMod)
  }

  onDelete (code, err, data) {
    if (code === 0) {
      this.doGetList()
      this.message('删除用户【' + data + '】成功', 'success')
    } else {
      this.error(err)
    }
  }

  doDelete (account) {
    this.post(this.$uris.deleteLocalUser, { account: account }, this.onDelete)
  }

  showResetPassword(row) {
    this.info.resetPassword.args.account = row.account
    this.info.resetPassword.args.password = ''
    this.info.resetPassword.confirm.password = ''
    this.info.resetPassword.confirm.name = row.name
    this.info.resetPassword.error.code = 0
    this.info.resetPassword.error.summary = ''
    this.info.resetPassword.error.detail = ''
    this.info.resetPassword.submitting = false
    this.info.resetPassword.disable = true
    this.info.resetPassword.visible = true
  }

  onResetPasswordInput() {
    this.info.resetPassword.error.code = 0
    this.info.resetPassword.error.summary = ''
    this.info.resetPassword.error.detail = ''

    if (this.isNullOrEmpty(this.info.resetPassword.args.password) || this.isNullOrEmpty(this.info.resetPassword.confirm.password)) {
      this.info.resetPassword.disable = true
    } else {
      this.info.resetPassword.disable = false
    }
  }

  onResetPassword (code, err, data) {
    this.info.resetPassword.submitting = false
    this.info.resetPassword.error.code = code

    if (code === 0) {
      this.info.resetPassword.visible = false
    } else {
      this.info.resetPassword.error.summary = err.summary
      this.info.resetPassword.error.detail = err.detail
    }
  }

  doResetPassword () {
    if (this.info.resetPassword.submitting) {
      return
    }

    if (this.info.resetPassword.args.password !== this.info.resetPassword.confirm.password) {
      this.info.resetPassword.error.code = 7
      this.info.resetPassword.error.summary = '输入错误'
      this.info.resetPassword.error.detail = '"密码"和"确认密码"不一致'
      return
    }

    this.info.resetPassword.error.code = 0
    this.info.resetPassword.error.summary = ''
    this.info.resetPassword.error.detail = ''
    this.info.resetPassword.submitting = true
    this.post(this.$uris.resetLocalUserPassword, this.info.resetPassword.args, this.onResetPassword)
  }

  showChangePassword(row) {
    this.info.changePassword.args.account = row.account
    this.info.changePassword.args.oldPassword = ''
    this.info.changePassword.args.newPassword = ''
    this.info.changePassword.confirm.newPassword = ''
    this.info.changePassword.confirm.name = row.name
    this.info.changePassword.error.code = 0
    this.info.changePassword.error.summary = ''
    this.info.changePassword.error.detail = ''
    this.info.changePassword.submitting = false
    this.info.changePassword.disable = true
    this.info.changePassword.visible = true
  }

  onChangePasswordInput() {
    this.info.changePassword.error.code = 0
    this.info.changePassword.error.summary = ''
    this.info.changePassword.error.detail = ''

    if (this.isNullOrEmpty(this.info.changePassword.args.oldPassword) ||
      this.isNullOrEmpty(this.info.changePassword.args.newPassword)||
      this.isNullOrEmpty(this.info.changePassword.confirm.newPassword)) {
      this.info.changePassword.disable = true
    } else {
      this.info.changePassword.disable = false
    }
  }

  onChangePassword (code, err, data) {
    this.info.changePassword.submitting = false
    this.info.changePassword.error.code = code

    if (code === 0) {
      this.info.changePassword.visible = false
    } else {
      this.info.changePassword.error.summary = err.summary
      this.info.changePassword.error.detail = err.detail
    }
  }

  doChangePassword () {
    if (this.info.changePassword.submitting) {
      return
    }

    if (this.info.changePassword.args.newPassword !== this.info.changePassword.confirm.newPassword) {
      this.info.changePassword.error.code = 7
      this.info.changePassword.error.summary = '输入错误'
      this.info.changePassword.error.detail = '"新密码"和"确认新密码"不一致'
      return
    }

    this.info.changePassword.error.code = 0
    this.info.changePassword.error.summary = ''
    this.info.changePassword.error.detail = ''
    this.info.changePassword.submitting = true
    this.post(this.$uris.changeLocalUserPassword, this.info.changePassword.args, this.onChangePassword)
  }

  onGetList (code, err, data) {
    this.info.list.loading = false

    if (code === 0) {
      this.info.list.items = data
    } else {
      this.info.list.items = []
      this.info.list.error.summary = err.summary
      this.info.list.error.detail = err.detail
    }
  }

  doGetList () {
    if (this.info.list.loading) {
      return
    }

    this.info.list.error.summary = ''
    this.info.list.error.detail = ''
    this.info.list.loading = true
    this.post(this.$uris.getLocalUsers, null, this.onGetList)
  }

  mounted() {
    this.doGetList()
    const account = this.$db.get(this.$db.keys.account)
    this.info.account = account.toLowerCase()
  }
}

export default UserList
</script>

<style scoped>
  .table :deep(.el-table--small td) {
    padding: 0;
    margin: 0;
  }
  .table :deep(.el-table--small tr th) {
    padding: 0;
    background-color: #f8f8f8;
  }
  .table :deep(.el-table__empty-text) {
    width: 100%;
    text-align: left;
    line-height: normal;
  }
  .table :deep(.el-button) {
    padding: 0;
  }
</style>
