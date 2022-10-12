<template>
  <el-card :body-style="bodyStyle">
    <div slot="header" class="header">
      <div>
        <span>应用程序</span>
        <el-badge class="badge" type="primary" :value="itemCount" v-if="itemCount > 0"/></div>
      <div>
        <el-tooltip placement="top">
          <div slot="content">
            <span>刷新</span>
          </div>
          <el-button type="text" icon="el-icon-refresh" @click="doGetList"/>
        </el-tooltip>
      </div>
    </div>
    <el-table v-loading="info.loading"
              aelement-loading-text="加载中..."
              element-loading-spinner="el-icon-loading"
              size="small"
              :max-height="maxHeight"
              :data="info.items"
              :border="true"
              :stripe="true">
      <el-table-column
          label="名称"
          prop="name"
          align="right"/>
      <el-table-column
          label="版本号"
          prop="version"
          width="95px"/>
      <el-table-column
          label="发布时间"
          prop="deployTime"
          width="135px" />
      <el-table-column width="125px">
        <template slot="header">
          <el-button type="text" size="small" @click="mod.visible = true">上传</el-button>
        </template>
        <template slot-scope="scope">
          <a :href="toDownloadUrl(scope.row.name)" target="_blank">
            <el-button type="text" class="btn" size="small" >
              <span>下载</span>
            </el-button>
          </a>
          <el-popconfirm :title="'确定要删除应用(' + scope.row.name + ')吗？'"
                         @confirm="doDelete(scope.row.name)">
            <el-button slot="reference" type="text" size="small">删除</el-button>
          </el-popconfirm>
          <el-button type="text" size="small" @click="showDetailDlg(scope.row)">详情</el-button>
        </template>
      </el-table-column>
    </el-table>

    <fileUpload v-model="mod.visible"
                width="580px"
                labelWidth="80px"
                title="上传并更新应用程序"
                accept=".war, .zip, .tar, .gz"
                :forms="mod.forms"
                :uri="mod.uri">
      <el-form-item label="服务名称">
        <el-input v-model="mod.forms[0].value" :readonly="true"/>
      </el-form-item>
    </fileUpload>

    <fileDetail v-model="detail.visible"
                title="应用程序详情"
                :uri="detail.uri"
                :argument="detail.args" />
  </el-card>
</template>

<script>
import Component from 'vue-class-component'
import SocketBase from '@/components/SocketBase'
import FileUpload from '@/components/dlg/FileUpload'
import FileDetail from '@/components/svc/Detail'

@Component({
  components: {
    fileUpload: FileUpload,
    fileDetail: FileDetail
  },
  props: {
    name: {
      type: String,
      default: ''
    },
    maxHeight: {
      type: [String, Number],
      default: '—'
    }
  }
})
class App extends SocketBase {
  bodyStyle = {
    padding: '0px 0px 0px 0px'
  }

  info = {
    loading: false,
    items: [],
    error: {
      summary: '',
      detail: ''
    }
  }

  mod = {
    visible: false,
    uri: this.$uris.svcTomcatAppMod,
    forms: [
      {
        name: 'name',
        value: ''
      }
    ]
  }

  detail = {
    visible: false,
    uri: this.$uris.svcTomcatAppDetail,
    args: {
      name: '',
      app: ''
    }
  }

  protocol = document.location.protocol
  host = this.$db.get(this.$db.keys.host)
  token = this.$db.get(this.$db.keys.token)
  downloadUri = this.$uris.svcTomcatAppDownload

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

  toDownloadUrl (app) {
    return this.protocol + '//' + this.host + this.downloadUri + this.name + '/' + app + '?token=' + this.token
  }

  showDetailDlg (row) {
    if (!row) {
      return
    }

    this.detail.args.name = this.name
    this.detail.args.app = row.name
    this.detail.visible = true
  }

  onDelete (code, err, data) {
    if (code === 0) {
      this.message('删除应用(' + data.name + ' => ' + data.app + ')成功', 'success')
    } else {
      this.error(err)
    }
  }

  doDelete (name) {
    const argument = {
      name: this.name,
      app: name
    }

    this.post(this.$uris.svcTomcatAppDel, argument, this.onDelete)
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

    const argument = {
      name: this.name
    }

    this.info.loading = true
    this.info.error.summary = ''
    this.info.error.detail = ''
    this.post(this.$uris.svcTomcatAppList, argument, this.onGetList)
  }

  onSocketMessage (id, data) {
    if (id === this.$evt.id.wsTomcatAppAdded ||
        id === this.$evt.id.wsTomcatAppUpdated ||
        id === this.$evt.id.wsTomcatAppDeleted) {
      if (data.name === this.name) {
        this.doGetList()
      }
    }
  }

  mounted () {
    this.doGetList()
    this.mod.forms[0].value = this.name
  }
}

export default App
</script>

<style scoped>
  .el-card :deep(.el-card__header) {
    background-color: #f8f8f8;
    padding: 6px;
  }
  .header {
    display: flex;
    align-items: center;
  }
  .header div {
    display: flex;
    align-items: center;
  }

  .header div:first-child {
    flex: 1;
  }
  .header div:first-child i {
    width: 30px;
    text-align: center;
  }
</style>
