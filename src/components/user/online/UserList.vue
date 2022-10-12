<template>
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
      <el-table-column label="账号" prop="userAccount" />
      <el-table-column label="姓名" prop="userName" />
      <el-table-column label="凭证" prop="token" width="200px" />
      <el-table-column label="IP地址" prop="loginIp" width="120px" />
      <el-table-column label="登陆时间" prop="loginTime" width="150px" />
      <el-table-column width="95px">
        <template #header>
          <el-button type="text" size="small" icon="el-icon-refresh" :loading="info.list.loading" @click="doGetList" >
            <span>刷新</span>
          </el-button>
        </template>
      </el-table-column>
      <template slot="empty">
        <el-alert v-if="info.list.error.code !== 0" type="error" :closable="false" :title="info.list.error.summary" :description="info.list.error.detail" />
        <span v-else></span>
      </template>
    </el-table>
  </div>
</template>

<script>
import Component from 'vue-class-component'
import SocketBase from '@/components/SocketBase'

@Component
class UserList extends SocketBase {
  tableHeight = this.getBodyHeight()
  info = {
    list: {
      loading: false,
      items: [
      //  {
      //    token: '',
      //    userAccount: '',
      //    userName: '',
      //    loginIp: '',
      //    loginTime: '',
      //    loginDuration: ''
      //  }
      ],
      error: {
        code: 0,
        summary: '',
        detail: ''
      }
    }
  }

  onElementHeightChanged (v) {
    this.tableHeight = v
  }

  onGetList (code, err, data) {
    this.info.list.loading = false
    this.info.list.error.code = code

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

    this.info.list.error.code = 0
    this.info.list.error.summary = ''
    this.info.list.error.detail = ''
    this.info.list.loading = true
    this.post(this.$uris.getOnlineUsers, null, this.onGetList)
  }

  onSocketMessage (id, data) {
    if (id === this.$evt.id.wsOptUserOnline || id === this.$evt.id.wsOptUserOffline) {
      this.doGetList()
    }
  }

  mounted () {
    this.doGetList()
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
