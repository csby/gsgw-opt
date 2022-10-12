<template>
  <el-card :body-style="bodyStyle">
    <div slot="header" class="header">
      <div>
        <span>应用配置</span>
        <span v-show="info.selected.value" style="padding-left: 5px; font-weight: bold; font-size: x-small;">[ {{info.selected.name}} ]</span>
      </div>
      <div v-show="info.selected.value && info.selected.folder === false">
        <el-tooltip placement="top">
          <div slot="content">
            <span>查看</span>
          </div>
          <a :href="toViewUrl(info.selected.path)" target="_blank">
            <el-button type="text" icon="el-icon-view" />
          </a>
        </el-tooltip>
      </div>
      <div v-show="info.selected.value">
        <el-tooltip placement="top">
          <div slot="content">
            <span>下载</span>
          </div>
          <a :href="toDownUrl(info.selected.path)" target="_blank">
            <el-button type="text" icon="el-icon-download" />
          </a>
        </el-tooltip>
      </div>
      <div v-show="info.selected.value">
        <el-tooltip placement="top">
          <div slot="content">
            <span>删除</span>
          </div>
          <el-popconfirm :title="'确定要删除(' + info.selected.name + ')吗？'"
                               @confirm="doDelete(info.selected.path)">
          <el-button slot="reference" type="text" icon="el-icon-delete"/>
        </el-popconfirm>
        </el-tooltip>
      </div>
      <div>
        <el-tooltip placement="top">
          <div slot="content">
            <span>上传文件</span>
          </div>
          <el-button type="text" icon="el-icon-document-add" @click="mod.visible = true"/>
        </el-tooltip>
      </div>
      <div>
        <el-tooltip placement="top">
          <div slot="content">
            <span>新建文件夹</span>
          </div>
          <el-button type="text" icon="el-icon-folder-add" @click="showAddDlg"/>
        </el-tooltip>
      </div>
      <div>
        <el-tooltip placement="top">
          <div slot="content">
            <span>刷新</span>
          </div>
          <el-button type="text" icon="el-icon-refresh" @click="doGetList"/>
        </el-tooltip>
      </div>
    </div>
    <div :style="treeStyle">
      <el-tree :data="info.items" empty-text=""
               :highlight-current="true"
               :default-expand-all="false"
               :show-checkbox="false"
               :expand-on-click-node="false"
               @current-change="onCurrentChanged">
        <span slot-scope="{ node, data }">
          <span v-if="data.folder" style="font-weight: bold;">
            <i v-if="node.expanded" class="el-icon-folder-opened"></i>
            <i v-else class="el-icon-folder"></i>
            <span style="margin-left: 6px;">{{data.name}}</span>
          </span>
          <span v-else>
            <i class="el-icon-document"></i>
            <span style="margin-left: 6px;">{{data.name}}</span>
          </span>
        </span>
      </el-tree>
    </div>

    <fileUpload v-model="mod.visible"
                width="580px"
                labelWidth="80px"
                title="上传并更新应用配置文件"
                accept=".*"
                :forms="mod.forms"
                :uri="mod.uri">
      <el-form-item label="服务名称">
        <el-input v-model="mod.forms[0].value" :readonly="true"/>
      </el-form-item>
    </fileUpload>

    <el-dialog :visible.sync="add.visible"
               title="添加应用配置文件夹"
               width="400px"
               :append-to-body="true"
               :close-on-click-modal="false">
      <el-form size="small">
        <el-form-item label="文件夹名称">
          <el-input v-model="add.args.folder"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="add.visible = false">取 消</el-button>
    <el-button type="primary" :loading="add.submitting" @click="doAddFolder">确 定</el-button>
  </span>
    </el-dialog>
  </el-card>
</template>

<script>
import Component from 'vue-class-component'
import SocketBase from '@/components/SocketBase'
import FileUpload from '@/components/dlg/FileUpload'

@Component({
  components: {
    fileUpload: FileUpload
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
class Cfg extends SocketBase {
  bodyStyle = {
    padding: '0px 0px 0px 0px'
  }

  info = {
    loading: false,
    items: [],
    error: {
      summary: '',
      detail: ''
    },
    selected: {
      value: false,
      folder: true,
      path: '',
      name: ''
    }
  }

  mod = {
    visible: false,
    uri: this.$uris.svcTomcatCfgMod,
    forms: [
      {
        name: 'name',
        value: ''
      },
      {
        name: 'path',
        value: ''
      }
    ]
  }

  add = {
    visible: false,
    submitting: false,
    uri: this.$uris.svcTomcatCfgFolderAdd,
    args: {
      name: '',
      path: '',
      folder: ''
    },
    error: {
      summary: '',
      detail: ''
    }
  }

  protocol = document.location.protocol
  host = this.$db.get(this.$db.keys.host)
  token = this.$db.get(this.$db.keys.token)
  viewUri = this.$uris.svcTomcatCfgView
  downUri = this.$uris.svcTomcatCfgDownload

  get isError () {
    if (this.isNotNullOrEmpty(this.info.error.summary) || this.isNotNullOrEmpty(this.info.error.detail)) {
      return true
    } else {
      return false
    }
  }

  get treeStyle () {
    const minHeight = this.maxHeight + 'px'
    return {
      'max-height': minHeight,
      overflow: 'auto'
    }
  }

  toViewUrl (path) {
    return this.protocol + '//' + this.host + this.viewUri + this.name + '/' + path + '?token=' + this.token
  }

  toDownUrl (path) {
    return this.protocol + '//' + this.host + this.downUri + this.name + '/' + path + '?token=' + this.token
  }

  onCurrentChanged (data, node) {
    if (data) {
      this.info.selected.path = data.path
      this.info.selected.folder = data.folder

      let folder = data.name
      let parent = node.parent
      while (parent) {
        if (!parent.data) {
          break
        }
        if (parent.data.folder === true) {
          folder = parent.data.name + '/' + folder
        } else if (parent.data.folder === false) {
        } else {
          break
        }
        parent = parent.parent
      }
      this.info.selected.name = folder
      this.info.selected.value = true
    } else {
      this.info.selected.path = ''
      this.info.selected.name = ''
      this.info.selected.value = false
    }

    this.mod.forms[1].value = this.info.selected.path
  }

  showAddDlg () {
    this.add.args.name = this.name
    this.add.args.path = this.info.selected.path
    this.add.args.folder = ''
    this.add.error.summary = ''
    this.add.error.detail = ''
    this.add.visible = true
  }

  onAddFolder (code, err, data) {
    this.add.submitting = false
    if (code === 0) {
      this.message('新建文件夹成功')
      this.add.visible = false
    } else {
      this.add.error.summary = err.summary
      this.add.error.detail = err.detail
    }
  }

  doAddFolder () {
    if (this.info.submitting) {
      return
    }

    this.add.submitting = true
    this.add.error.summary = ''
    this.add.error.detail = ''
    this.post(this.$uris.svcTomcatCfgFolderAdd, this.add.args, this.onAddFolder)
  }

  onDelete (code, err, data) {
    if (code === 0) {
      this.message('删除成功', 'success')
    } else {
      this.error(err)
    }
  }

  doDelete (path) {
    const argument = {
      name: this.name,
      path: path
    }

    this.post(this.$uris.svcTomcatCfgDel, argument, this.onDelete)
  }

  onGetList (code, err, data) {
    this.info.loading = false
    this.info.selected.value = false
    this.info.selected.path = ''
    this.info.selected.name = ''
    this.mod.forms[1].value = this.info.selected.path

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
    this.post(this.$uris.svcTomcatCfgTree, argument, this.onGetList)
  }

  onSocketMessage (id, data) {
    if (id === this.$evt.id.wsTomcatCfgAdded ||
        id === this.$evt.id.wsTomcatCfgUpdated ||
        id === this.$evt.id.wsTomcatCfgDeleted) {
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

export default Cfg
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
