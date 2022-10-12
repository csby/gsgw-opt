<template>
  <el-card :body-style="bodyStyle" shadow="never">
    <div slot="header" class="header">
      <div>
        <i class="el-icon-s-opportunity" ></i>
        <span>监听端口</span>
        <el-badge class="badge" type="info" :value="itemCount" v-if="itemCount > 0"/>
      </div>
      <div >
        <el-button style="padding: 3px 5px;" type="text" icon="el-icon-refresh" @click="doSearch">
          <span>刷新</span>
        </el-button>
      </div>
    </div>

    <tableList class="content"
               ref="tableList"
               :uri="this.$uris.monitorListenPorts"
               size="small"
               :border="false"
               :max-height="360"
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
  </el-card>
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
  }
})
class Listening extends VueBase {
  bodyStyle = {
    padding: '0px'
  }

  itemCount = 0

  onSearched (data) {
    if (data) {
      this.itemCount = data.length
    } else {
      this.itemCount = 0
    }
  }

  doSearch () {
    this.$refs.tableList.doSearch()
  }
}

export default Listening
</script>

<style scoped>
  .el-card :deep(.el-card__header) {
    background-color: #f8f8f8;
    padding: 2px 4px 2px 8px;
  }
  .el-card :deep(.el-table__header-wrapper tr th) {
    background-color: #f8f8f8;
    padding: 2px 0px 1px 0px;
  }
  .el-card :deep(.el-table--small td ){
    padding: 0;
    margin: 0;
  }

  .header {
    display: flex;
    align-items: center;
    height: 25px;
    padding: 0;
    background-color: #f8f8f8;
  }
  .header :deep(.el-button) {
    padding: 0px 2px;
    margin-top: 0px;
    margin-bottom: 0px;
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
  .header div:last-child :not(:last-child){
    margin-right: 5px;
  }
  .badge {
    padding: 0;
    margin-top: 3px;
  }
</style>
