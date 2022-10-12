<template>
  <svcPage title="nginx服务" :count="itemCount">
    <template slot="button">
      <el-tooltip placement="left">
        <div slot="content">
          <span>刷新</span>
        </div>
        <el-button type="text" icon="el-icon-refresh" @click="doGetList"/>
      </el-tooltip>
    </template>
    <div class="table" slot-scope="page">
      <el-table v-loading="info.loading"
                aelement-loading-text="加载中..."
                element-loading-spinner="el-icon-loading"
                size="small"
                :max-height="page.client - page.top - page.head"
                :data="info.items"
                :border="true"
                :stripe="true">
        <el-table-column type="expand">
          <div slot-scope="scope" class="cell-expand">
            <div style="padding-left: 10px;">
              <pre>{{scope.row.remark}}</pre>
            </div>
            <webApp :service="scope.row.serviceName" :items="scope.row.locations" />
          </div>
        </el-table-column>
        <el-table-column
            label="项目名称"
            prop="name" />
        <el-table-column
            label="服务名称"
            prop="serviceName" width="200px" />
        <el-table-column label="状态" width="100px">
          <template slot-scope="scope">
            <span v-if="scope.row.status === 1" class="status-running">运行中</span>
            <span v-else-if="scope.row.status === 2" class="status-stopped">已停止</span>
            <span v-else class="status-uninstall">未安装</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="95px">
          <template slot-scope="scope">
            <template v-if="scope.row.status === 1">
              <el-button type="text" size="small" @click="page.action(scope.row.serviceName, act.stop)">停止</el-button>
              <el-button type="text" size="small" @click="page.action(scope.row.serviceName, act.restart)">重启</el-button>
            </template>
            <template v-if="scope.row.status === 2">
              <el-button type="text" size="small" @click="page.action(scope.row.serviceName, act.start)">启动</el-button>
            </template>
          </template>
        </el-table-column>
        <template slot="empty">
            <span v-if="isError" class="error">
                <i class="el-icon-error"></i>
                <div class="error-summary">{{error.summary}}</div>
                <div class="error-detail">{{error.detail}}</div>
            </span>
          <span v-else>暂无数据</span>
        </template>
      </el-table>
    </div>
  </svcPage>
</template>

<script>
import Component from 'vue-class-component'
import SocketBase from '@/components/SocketBase'
import SvcPage from '@/components/svc/Page'
import WebApp from '@/views/authorized/service/nginx/App'

@Component({
  components: {
    svcPage: SvcPage,
    webApp: WebApp
  }
})
class Index extends SocketBase {
  info = {
    loading: false,
    items: [],
    error: {
      summary: '',
      detail: ''
    }
  }

  act = {
    start: this.$uris.svcNginxStart,
    stop: this.$uris.svcNginxStop,
    restart: this.$uris.svcNginxRestart
  }

  get itemCount () {
    return this.info.items.length
  }

  get isError () {
    if (this.isNotNullOrEmpty(this.info.error.summary) || this.isNotNullOrEmpty(this.info.error.detail)) {
      return true
    } else {
      return false
    }
  }

  onGetList (code, err, data) {
    this.info.loading = false
    if (code === 0) {
      this.info.items = data
    } else {
      this.info.items = []
      this.info.error.summary = err.summary
      this.info.error.detail = err.detail
    }
  }

  doGetList () {
    if (this.info.loading) {
      return
    }

    this.info.loading = true
    this.info.error.summary = ''
    this.info.error.detail = ''
    this.post(this.$uris.svcNginxList, null, this.onGetList)
  }

  onSocketMessage (id, data) {
    if (id === this.$evt.id.wsSvcStatusChanged) {
      if (data && this.info.items) {
        const count = this.info.items.length
        for (let index = 0; index < count; index++) {
          const item = this.info.items[index]
          if (item) {
            if (data.name === item.serviceName) {
              item.status = data.status
              break
            }
          }
        }
      }
    }
  }

  mounted () {
    this.$nextTick(this.fireRoutePathChanged)
    this.doGetList()
  }
}

export default Index
</script>

<style scoped>
  .table {
  }
  .table :deep(.el-table th.el-table__cell) {
    padding: 2px 0px;
    margin: 0;
  }
  .table :deep(.el-table--small td) {
    padding: 0;
    margin: 0;
  }
  .table :deep(.el-button) {
    padding: 1px 8px 0px 0px;
    margin: 0;
  }

  .cell-expand {
    padding: 1px 2px 5px 48px;
  }
</style>
