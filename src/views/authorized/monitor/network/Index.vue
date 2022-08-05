<template>
  <monitorPage title="网卡"
               :uri="this.$uris.monitorNetworkInterfaces"
               :filter="filterData"
               :min="0">
    <el-table-column type="expand">
      <div slot-scope="scope">
        <div></div>
        <throughput :name="scope.row.name" :ips="scope.row.ipAddress" />
      </div>
    </el-table-column>
    <el-table-column
      label="网卡名称"
      prop="name" />
    <el-table-column
      label="最大传输单元"
      prop="mtu"
      width="130px" />
    <el-table-column
      label="标志"
      prop="flags"
      width="180px"
      :formatter="fmtFlags" />
    <el-table-column
      label="MAC地址"
      prop="macAddress"
      width="120px" />
    <el-table-column
      label="IP地址"
      prop="ipAddress"
      width="200px"
      :formatter="fmtIpAddress" />
  </monitorPage>
</template>

<script>
import Component from 'vue-class-component'
import SocketBase from '@/components/SocketBase'
import MonitorPage from '@/components/monitor/Page'
import Throughput from '@/components/monitor/network/Throughput'

@Component({
  components: {
    monitorPage: MonitorPage,
    throughput: Throughput
  }
})
class Index extends SocketBase {
  filterData (data) {
    if (!data) {
      return false
    }
    return this.isNotNullOrEmpty(data.macAddress)
  }

  fmtIpAddress (row, column, cellValue, index) {
    let val = ''
    if (cellValue) {
      val = cellValue[0]
      for (let i = 0; i < cellValue.length; i++) {
        const ip = cellValue[i]
        if (ip.indexOf(':') !== -1) {
          continue
        }
        val = ip
        break
      }
    }
    return val
  }

  fmtFlags (row, column, cellValue, index) {
    let val = ''
    if (cellValue) {
      if (cellValue.length > 0) {
        val = cellValue[0]
        for (let i = 1; i < cellValue.length; i++) {
          val += ' ' + cellValue[i]
        }
      }
    }
    return val
  }

  mounted() {
    this.$nextTick(this.fireRoutePathChanged)
  }
}

export default Index
</script>

<style scoped>

</style>
