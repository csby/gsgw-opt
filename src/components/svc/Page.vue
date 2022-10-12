<template>
  <div>
    <div class="header">
      <i :class="icon"></i>
      <span>{{title}}</span>
      <el-badge class="badge" type="info" :value="count" v-if="count > 0"/>
      <div>
        <slot name="button" />
        <el-tooltip placement="left">
          <div slot="content">
            <span>监听端口</span>
          </div>
          <el-button type="text" icon="el-icon-s-opportunity" @click="port.visible = true"/>
        </el-tooltip>
      </div>
    </div>
    <slot :client="heights.client"
          :top="heights.top"
          :head="heights.head"
          :action="doAction"/>

    <port-viewer v-model="port.visible" />
  </div>
</template>

<script>
import Component from 'vue-class-component'
import VueBase from '@/components/VueBase'
import TableList from '@/components/TableList'
import PortViewer from '@/components/monitor/network/ListeningDrawer'

@Component({
  components: {
    tableList: TableList,
    portViewer: PortViewer
  },
  props: {
    icon: {
      type: String,
      default: 'el-icon-setting'
    },
    title: {
      type: String,
      default: ''
    },
    count: {
      type: Number,
      default: 0
    }
  }
})
class Page extends VueBase {
  port = {
    visible: false
  }

  heights = {
    client: (window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight) - 1,
    top: 30,
    head: 25
  }

  onSizeChanged () {
    const clientHeight = window.innerHeight ||
        document.documentElement.clientHeight ||
        document.body.clientHeight

    const paddingHeight = 1
    this.heights.client = clientHeight - paddingHeight
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

  doSearch () {
    this.$refs.tableList.doSearch()
  }

  mounted () {
    window.addEventListener('resize', this.onSizeChanged)
    this.onSizeChanged()
  }

  beforeDestroy () {
    window.removeEventListener('resize', this.onSizeChanged)
  }
}

export default Page
</script>

<style scoped>
  .header {
    display: flex;
    align-items: center;
    height: 25px;
    padding: 0px 8px;
    background-color: #f8f8f8;
  }
  .header :deep(.el-button) {
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
  .badge {
    padding: 0;
    margin-top: 3px;
  }

  .drawer {
  }
  .drawer :deep(.el-drawer__header){
    background-color: #0078D7;
    color: white;
    height: 26px;
    padding: 2px 10px;
    margin-bottom: 0px;
    margin-top: 0px;
  }
  .drawer :deep(.el-drawer__body){
    margin: 0;
    padding: 0;
  }
  .drawer :deep(.el-table--small td) {
    padding: 0;
    margin: 0;
  }
  .drawer-header {
    height: 26px;
    display: flex;
    align-items: center;
  }
  .drawer-header :deep(.el-button) {
    padding: 0px 3px;
    font-size: medium;
    color: #f2f2f2;
  }
  .drawer-header i{
    padding-right: 5px;
  }
  .drawer-header :last-child {
    flex: 1;
    text-align: right;
  }
</style>
