<template>
  <el-drawer class="drawer"
             direction="rtl"
             size="520px"
             :append-to-body="true"
             :destroy-on-close="true"
             :visible.sync="port.visible"
             @closed="handleInput(false)">
    <div slot="title" class="drawer-header">
      <i class="el-icon-s-opportunity"></i>
      <span>监听端口</span>
      <el-badge class="badge" type="info" :value="port.count" v-if="port.count > 0"/>
      <el-button type="text" icon="el-icon-refresh" @click="doSearch"/>
    </div>
    <tableList class="content"
               ref="tableList"
               :uri="port.uri"
               size="small"
               :border="false"
               :max-height="heights.client - heights.top"
               @searched="onSearched">
      <template slot="columns">
        <el-table-column
          label="序号"
          type="index"
          width="55"
          align="right">
        </el-table-column>
        <el-table-column
          prop="address"
          label="地址"
          align="right">
        </el-table-column>
        <el-table-column
          prop="port"
          label="端口"
          width="85px"
          align="left">
        </el-table-column>
        <el-table-column
          prop="protocol"
          label="协议"
          width="65px"
          align="left">
        </el-table-column>
        <el-table-column
          label="进程ID"
          width="70px"
          align="left">
          <template slot-scope="scope">
            <processInfo v-if="scope.row.pid > 0"
                         :pid="scope.row.pid"
                         :port="scope.row.port"
                         :protocol="scope.row.protocol"
                         :address="scope.row.address"/>
            <span v-else></span>
          </template>
        </el-table-column>
      </template>
    </tableList>
  </el-drawer>
</template>

<script>
import Component from 'vue-class-component'
import VueBase from '@/components/VueBase'
import TableList from '@/components/TableList'
import ProcessInfo from '@/components/monitor/network/PortProcess'

@Component({
  components: {
    tableList: TableList,
    processInfo: ProcessInfo
  },
  props: {
    value: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    value: {
      handler: 'onVisibleChanged'
    }
  }
})
class ListeningDrawer extends VueBase {
  port = {
    visible: false,
    count: 0,
    uri: this.$uris.monitorListenPorts
  }

  heights = {
    client: (window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight) - 1,
    top: 30,
    head: 25
  }

  handleInput (value) {
    this.$emit('input', value)
  }

  onVisibleChanged (val) {
    this.port.visible = val
    if(val) {
      this.doSearch()
    }
  }

  onSizeChanged () {
    const clientHeight = window.innerHeight ||
      document.documentElement.clientHeight ||
      document.body.clientHeight

    const paddingHeight = 1
    this.heights.client = clientHeight - paddingHeight
  }

  onSearched (data) {
    if (data) {
      this.port.count = data.length
    } else {
      this.port.count = 0
    }
  }

  doSearch () {
    const refs = this.$refs
    if (!refs) {
      return
    }

    const tableList = refs.tableList
    if (!tableList) {
      return
    }

    tableList.doSearch()
  }

  mounted () {
    window.addEventListener('resize', this.onSizeChanged)
    this.onSizeChanged()
  }

  beforeDestroy () {
    window.removeEventListener('resize', this.onSizeChanged)
  }
}

export default ListeningDrawer
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
  .drawer-header :last-child {
    flex: 1;
    text-align: right;
  }
</style>
