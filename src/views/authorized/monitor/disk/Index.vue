<template>
  <monitorPage title="磁盘分区"
               :uri="this.$uris.monitorDiskUsageList"
               :argument="argument"
               :tableRowClass="tableRowClassName">
    <template slot="button" slot-scope="button">
      <span style="font-weight: lighter;">显示全部</span>
      <el-checkbox v-model="argument.all" @change="button.action()"></el-checkbox>
    </template>
    <el-table-column
      label="分区"
      prop="path" />
    <el-table-column
      label="磁盘空间"
      prop="totalText"
      width="130px" />
    <el-table-column
      label="已用空间大小"
      prop="usedText"
      width="120px" />
    <el-table-column
      label="已用空间 (%)"
      prop="usedPercent"
      width="100px"
      :formatter="fmtUsedPercent" />
    <el-table-column
      label="可用空间大小"
      prop="freeText"
      width="120px" />
    <el-table-column
      label="可用空间 (%)"
      prop="usedPercent"
      width="100px"
      :formatter="fmtFreePercent" />
  </monitorPage>
</template>

<script>
import Component from 'vue-class-component'
import RoutingBase from '@/components/RoutingBase'
import MonitorPage from '@/components/monitor/Page'

@Component({
  components: {
    monitorPage: MonitorPage
  }
})
class Index extends RoutingBase {
  argument = {
    all: false
  }

  fmtUsedPercent (row, column, cellValue, index) {
    const v = cellValue
    return v.toFixed(1) + '%'
  }

  fmtFreePercent (row, column, cellValue, index) {
    const v = 100 - cellValue
    return v.toFixed(1) + '%'
  }

  tableRowClassName ({ row, rowIndex }) {
    if (row.usedPercent > 90) {
      return 'error-row'
    } else if (row.usedPercent > 80) {
      return 'warning-row'
    }

    return ''
  }
}

export default Index
</script>

<style scoped>

</style>
