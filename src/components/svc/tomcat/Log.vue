<template>
  <div>
    <div class="header">
      <div>
        <span>服务日志: {{displayName}}</span>
        <span v-show="info.selected.value" style="padding-left: 5px; font-weight: bold; font-size: x-small;">[ {{info.selected.name}} ]</span>
      </div>
      <div>
        <el-tooltip v-show="info.selected.value && info.selected.folder === false" placement="left">
          <div slot="content">
            <span>查看</span>
          </div>
          <a :href="toViewUrl(info.selected.path)" target="_blank">
            <el-button type="text" icon="el-icon-view" />
          </a>
        </el-tooltip>
        <el-tooltip v-show="info.selected.value" placement="top">
          <div slot="content">
            <span>下载</span>
          </div>
          <a :href="toDownUrl(info.selected.path)" target="_blank">
            <el-button type="text" icon="el-icon-download" />
          </a>
        </el-tooltip>
        <el-tooltip v-show="info.selected.value" placement="top">
          <div slot="content">
            <span>删除</span>
          </div>
          <el-popconfirm :title="'确定要删除(' + info.selected.name + ')吗？'"
                         @confirm="doDelete(info.selected.path)">
            <el-button slot="reference" type="text" icon="el-icon-delete"/>
          </el-popconfirm>
        </el-tooltip>
        <el-tooltip placement="top">
          <div slot="content">
            <span>刷新</span>
          </div>
          <el-button type="text" icon="el-icon-refresh" @click="doGetList"/>
        </el-tooltip>
        <el-button type="text" icon="el-icon-close" @click="doClose" />
      </div>
    </div>
    <div class="body" :style="bodyStyle">
      <el-tree :data="info.items" empty-text=""
               :highlight-current="true"
               :default-expand-all="false"
               :show-checkbox="false"
               :expand-on-click-node="false"
               @current-change="onCurrentChanged">
        <div slot-scope="{ node, data }" style="width: 100%">
          <div v-if="data.folder" style="font-weight: bold;">
            <i v-if="node.expanded" class="el-icon-folder-opened"></i>
            <i v-else class="el-icon-folder"></i>
            <span style="margin-left: 6px; margin-right: 3px;">{{data.name}}</span>
            <el-badge class="badge" type="info" :value="data.children.length" v-if="data.children.length > 0"/>
          </div>
          <div v-else style="display: flex; align-items: center ;width: 100%;">
            <i class="el-icon-document"></i>
            <span style="flex: 1; margin-left: 6px;">{{data.name}}</span>
            <span style="color: #7c635d; padding-right: 8px; font-size: small;">{{data.sizeText}}</span>
            <span style="color: #8c939d; padding-right: 8px; font-size: small;">{{data.modTime}}</span>
          </div>
        </div>
      </el-tree>
    </div>
  </div>
</template>

<script>
import Component from 'vue-class-component'
import VueBase from '@/components/VueBase'

@Component({
  props: {
    name: {
      type: String,
      default: ''
    },
    displayName: {
      type: String,
      default: ''
    }
  }
})
class Log extends VueBase {
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

  protocol = document.location.protocol
  host = this.$db.get(this.$db.keys.host)
  token = this.$db.get(this.$db.keys.token)
  viewUri = this.$uris.svcTomcatLogView
  downUri = this.$uris.svcTomcatLogDownload

  bodyHeight = 0

  get bodyStyle () {
    const minHeight = this.bodyHeight + 'px'
    return {
      'min-height': minHeight,
      'max-height': minHeight
    }
  }

  onSizeChanged () {
    const clientHeight = window.innerHeight ||
        document.documentElement.clientHeight ||
        document.body.clientHeight

    const topHeight = 30
    const marginHeight = 0
    const paddingHeight = 1
    this.bodyHeight = clientHeight - topHeight - marginHeight - paddingHeight
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
  }

  doClose () {
    this.$emit('close')
  }

  onDelete (code, err, data) {
    if (code === 0) {
      this.message('删除成功', 'success')
      this.doGetList()
    } else {
      this.error(err)
    }
  }

  doDelete (path) {
    const argument = {
      name: this.name,
      path: path
    }

    this.post(this.$uris.svcTomcatLogDel, argument, this.onDelete)
  }

  onGetList (code, err, data) {
    this.info.loading = false
    this.info.selected.value = false
    this.info.selected.path = ''
    this.info.selected.name = ''

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
    this.post(this.$uris.svcTomcatLogTree, argument, this.onGetList)
  }

  mounted () {
    this.doGetList()
    window.addEventListener('resize', this.onSizeChanged)
    this.onSizeChanged()
  }

  beforeDestroy () {
    window.removeEventListener('resize', this.onSizeChanged)
  }
}

export default Log
</script>

<style scoped>
  .header {
    display: flex;
    align-items: center;
    height: 30px;
    padding: 0px 8px;
    background-color: #f8f8f8;
  }
  .header /deep/ .el-button {
    padding: 0px 2px;
    margin-top: 0px;
    margin-bottom: 0px;
    font-size: medium;
  }
  .header :not(:first-child) {
    margin-left: 3px;
  }
  .header i:first-child {
    margin-top: 2px;
  }
  .header div:last-child {
    flex: 1;
    text-align: right;
  }

  .body {
    overflow: auto;
  }
</style>
