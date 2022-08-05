<template>
  <svcPage title="tomcat服务" :count="itemCount">
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
            <div class="cell-expand-info">
              <div>
                <span>服务名称:</span>
                <span>{{scope.row.serviceName}}</span>
              </div>
              <div>
                <span>应用目录:</span>
                <span>{{scope.row.webApp}}</span>
              </div>
              <div>
                <span>配置目录:</span>
                <span>{{scope.row.webCfg}}</span>
              </div>
              <div>
                <span>日志目录:</span>
                <span>{{scope.row.webLog}}</span>
              </div>
              <div v-if="scope.row.webUrls" style="align-items: start;">
                <span>访问地址:</span>
                <div style="display: table; padding: 0;">
                  <div v-for="(url, index) in scope.row.webUrls" :key="index" style="padding: 2px 0 5px 0;">
                    <span/>
                    <a :href="url" target="_blank">{{url}}</a>
                  </div>
                </div>
              </div>
            </div>
            <el-row :gutter="5">
              <el-col :span="14">
                <svcApp :name="scope.row.serviceName" :max-height="cardHeight" />
              </el-col>
              <el-col :span="10">
                <svcCfg :name="scope.row.serviceName" :max-height="cardHeight" />
              </el-col>
            </el-row>
          </div>
        </el-table-column>
        <el-table-column
            label="项目"
            prop="name" />
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
        <el-table-column width="60px">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="showLog(scope.row)">日志</el-button>
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

      <el-drawer class="drawer" direction="rtl" size="720px"
                 :show-close="false"
                 :append-to-body="true"
                 :destroy-on-close="true"
                 :visible.sync="log.visible">
        <div class="drawer-body">
          <svcLog :name="log.name" :displayName="log.displayName" @close="log.visible = false" />
        </div>
      </el-drawer>
    </div>
  </svcPage>
</template>

<script>
import Component from 'vue-class-component'
import SocketBase from '@/components/SocketBase'
import SvcApp from '@/components/svc/tomcat/App'
import SvcCfg from '@/components/svc/tomcat/Cfg'
import SvcLog from '@/components/svc/tomcat/Log'
import SvcPage from '@/components/svc/Page'

@Component({
  components: {
    svcApp: SvcApp,
    svcCfg: SvcCfg,
    svcLog: SvcLog,
    svcPage: SvcPage
  }
})
class Index extends SocketBase {
  cardHeight = 200
  info = {
    loading: false,
    items: [],
    error: {
      summary: '',
      detail: ''
    }
  }

  act = {
    start: this.$uris.svcTomcatStart,
    stop: this.$uris.svcTomcatStop,
    restart: this.$uris.svcTomcatRestart
  }

  log = {
    visible: false,
    name: '',
    displayName: ''
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

  showLog (data) {
    if (!data) {
      return
    }

    this.log.name = data.serviceName
    this.log.displayName = data.name
    this.log.visible = true
  }

  onAction (code, err, data) {
    if (code === 0) {
    } else {
      this.error(err)
    }
  }

  doAction (name, uri) {
    const argument = {
      name: name
    }
    this.post(uri, argument, this.onAction)
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
    this.post(this.$uris.svcTomcatList, null, this.onGetList)
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
  .table /deep/ .el-table th.el-table__cell {
    padding: 2px 0px;
    margin: 0;
  }
  .table /deep/ .el-table--small td {
    padding: 0;
    margin: 0;
  }
  .table /deep/ .el-button {
    padding: 1px 8px 0px 0px;
    margin: 0;
  }

  .cell-expand {
    padding: 5px;
  }
  .cell-expand-info {
    padding: 2px 4px 2px 55px;
  }
  .cell-expand-info div {
    padding: 2px 0px;
    display: flex;
    align-items: center;
  }
  .cell-expand-info div :first-child {
    text-align: right;
    padding-right: 5px;
    color: darkgray;
  }

  .drawer {
  }
  .drawer /deep/ .el-drawer__header{
    background-color: #0078D7;
    color: white;
    padding: 0;
    margin: 0;
  }
  .drawer /deep/ .el-drawer__body{
    margin: 0;
    padding: 0;
  }
</style>
