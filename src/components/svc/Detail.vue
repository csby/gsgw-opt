<template>
  <el-drawer class="drawer"
             direction="rtl"
             size="680px"
             :append-to-body="true"
             :destroy-on-close="true"
             :visible.sync="visible"
             @closed="handleInput(false)">
    <div slot="title" class="drawer-header">
      <div>
        <i class="el-icon-files"></i>
        <span>{{title}}</span>
        <span v-show="info.selected.value" style="padding-left: 5px; font-weight: bold; font-size: xx-small;">[ {{info.selected.name}} ]</span>
      </div>
      <div style="flex: 1;" />
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
      <div v-show="info.selected.root === false && isNotNullOrEmpty(info.selected.path)">
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
      <div v-show="isNotNullOrEmpty(info.selected.path)">
        <el-tooltip placement="top">
          <div slot="content">
            <span>下载</span>
          </div>
          <a :href="toDownUrl(info.selected.path)" target="_blank">
            <el-button type="text" icon="el-icon-download" />
          </a>
        </el-tooltip>
      </div>
      <div v-show="isNotNullOrEmpty(info.selected.path)">
        <el-tooltip placement="top">
          <div slot="content">
            <span>上传文件</span>
          </div>
          <el-button type="text" icon="el-icon-upload2" @click="mod.visible = true"/>
        </el-tooltip>
      </div>
      <div>
        <el-button type="text" icon="el-icon-refresh" @click="doSearch"/>
      </div>
    </div>

    <div>
      <el-tree :data="info.items" empty-text=""
               :highlight-current="true"
               :default-expand-all="false"
               :show-checkbox="false"
               :expand-on-click-node="false"
               @current-change="onCurrentChanged">
        <div slot-scope="{ node, data }" style="width: 100%">
          <div v-if="data.folder" style="display: flex; align-items: center ;width: 100%; font-weight: bold;">
            <i v-if="node.expanded" class="el-icon-folder-opened"></i>
            <i v-else class="el-icon-folder"></i>
            <span style="margin-left: 6px; margin-right: 3px;">{{data.name}}</span>
            <el-badge class="badge" type="info" :value="data.children.length" v-if="data.children.length > 0"/>
            <div style="flex: 1; text-align: right; font-weight: normal;">
              <span style="color: #7c635d; padding-right: 8px; font-size: small;">{{toSizeText(data.size)}}</span>
              <span style="color: #8c939d; padding-right: 8px; font-size: small;">{{data.time}}</span>
            </div>
          </div>
          <div v-else style="display: flex; align-items: center ;width: 100%;">
            <i class="el-icon-document"></i>
            <span style="flex: 1; margin-left: 6px;">{{data.name}}</span>
            <span style="color: #7c635d; padding-right: 8px; font-size: small;">{{toSizeText(data.size)}}</span>
            <span style="color: #8c939d; padding-right: 8px; font-size: small;">{{data.time}}</span>
          </div>
        </div>
      </el-tree>
    </div>

    <fileUpload v-model="mod.visible"
                width="580px"
                labelWidth="80px"
                title="上传并更新文件"
                accept=".*"
                :forms="mod.forms"
                :uri="mod.uri"
                @onUploaded="onUploaded">
    </fileUpload>
  </el-drawer>
</template>

<script>
import Component from 'vue-class-component'
import VueBase from '@/components/VueBase'
import FileUpload from '@/components/dlg/FileUpload'

@Component({
  components: {
    fileUpload: FileUpload
  },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    },
    uri: {
      type: String,
      default: ''
    },
    argument: {
      type: Object,
      default: null
    }
  },
  watch: {
    value: {
      handler: 'onVisibleChanged'
    }
  }
})
class Detail extends VueBase {
  visible = false

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
      root: true,
      path: '',
      name: ''
    }
  }

  mod = {
    visible: false,
    uri: this.$uris.svcFileMod,
    forms: [
      {
        name: 'parent',
        value: ''
      }
    ]
  }

  unit = {
    kb: 1024,
    mb: 1024 * 1024,
    gb: 1024 * 1024 * 1024
  }

  protocol = document.location.protocol
  host = this.$db.get(this.$db.keys.host)
  token = this.$db.get(this.$db.keys.token)
  viewUri = this.$uris.svcFileContent
  downUri = this.$uris.svcFileDownload

  toSizeText (v) {
    const u = this.unit
    if (v >= u.gb) {
      const val = v / u.gb
      return val.toFixed(2) + 'GB'
    } else if (v >= u.mb) {
      const val = v / u.mb
      return val.toFixed(1) + 'MB'
    } else if (v >= u.kb) {
      return Math.round(v / u.kb) + 'KB'
    } else {
      return v + 'B'
    }
  }

  toViewUrl (path) {
    return this.protocol + '//' + this.host + this.viewUri + path + '?token=' + this.token
  }

  toDownUrl (path) {
    return this.protocol + '//' + this.host + this.downUri + path + '?token=' + this.token
  }

  handleInput (value) {
    this.$emit('input', value)
  }

  onVisibleChanged (val) {
    this.visible = val
    if (val) {
      this.info.selected.root = true
      this.info.selected.value = ''
      this.doSearch()
    }
  }

  onCurrentChanged (data, node) {
    if (data) {
      this.info.selected.path = data.path
      this.info.selected.folder = data.folder
      this.mod.forms[0].value = data.path

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
      this.info.selected.root = false
    } else {
      this.info.selected.path = ''
      this.info.selected.name = ''
      this.info.selected.value = false
      this.info.selected.root = true
    }
  }

  onUploaded (data) {
    this.doSearch()
    this.message('上传成功成功', 'success')
    this.mod.visible = false
  }

  onDelete (code, err, data) {
    if (code === 0) {
      this.message('删除成功', 'success')
      this.doSearch()
    } else {
      this.error(err)
    }
  }

  doDelete (path) {
    const argument = {
      path: path
    }

    this.post(this.$uris.svcFileDel, argument, this.onDelete)
  }

  onSearch (code, err, data) {
    this.info.loading = false
    if (code === 0) {
      this.info.selected.path = data.path
      if (data.children) {
        this.info.items = data.children
        this.info.selected.root = true
      }
      this.mod.forms[0].value = data.path
    } else {
      this.error(err)
    }
  }

  doSearch () {
    if (this.info.loading) {
      return
    }

    this.info.loading = true
    this.post(this.uri, this.argument, this.onSearch)
  }
}

export default Detail
</script>

<style scoped>
  .drawer {
  }
  .drawer /deep/ .el-drawer__header{
    background-color: #0078D7;
    color: white;
    height: 26px;
    padding: 2px 10px;
    margin-bottom: 0px;
    margin-top: 0px;
  }
  .drawer /deep/ .el-drawer__body{
    margin: 0;
    padding: 0;
  }
  .drawer /deep/ .el-table--small td {
    padding: 0;
    margin: 0;
  }
  .drawer-header {
    height: 26px;
    display: flex;
    align-items: center;
  }
  .drawer-header /deep/ .el-button {
    padding: 0px 3px;
    font-size: medium;
    color: #f2f2f2;
  }
  .drawer-header i{
    padding-right: 5px;
  }
</style>
