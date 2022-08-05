<template>
  <monitorPage title="CPU">
    <div slot="info">
      <span style="padding-right: 5px;">:</span>
      <span style="font-weight: bold;">{{info.cpuName}}</span>
    </div>
    <template slot="button">
      <el-button type="text" icon="el-icon-refresh" :loading="info.loading" @click="doGetCpuUsageList">刷新</el-button>
    </template>
    <template slot="custom">
      <div>
        <trend-chart v-if="info.curCount > 0"
                     class="trend"
                     :min="info.min"
                     :max="info.max"
                     :grid="info.grid"
                     :labels="info.labels"
                     :datasets="info.items">
        </trend-chart>
        <div style="padding: 1px 10px;">
          <span style="padding-right: 5px;">利用率:</span>
          <span style="font-weight: bold;">{{info.curPercent}}</span>
        </div>
      </div>
    </template>
  </monitorPage>
</template>

<script>
import Component from 'vue-class-component'
import SocketBase from '@/components/SocketBase'
import MonitorPage from '@/components/monitor/Page'

@Component({
  components: {
    monitorPage: MonitorPage
  }
})
class Index extends SocketBase {
  info = {
    loading: false,
    cpuName: '',
    maxCount: 0,
    curCount: 0,
    curPercent: '',
    min: 0,
    max: 100,
    labels: {
      xLabels: [],
      yLabels: 2,
      yLabelsTextFormatter: this.fmtValue
    },
    grid: {
      verticalLines: true,
      horizontalLines: true,
      horizontalLinesNumber: 6
    },
    items: [
      {
        data: [],
        smooth: true,
        fill: true
      }
    ],
    error: {
      summary: '',
      detail: ''
    }
  }

  fmtValue (v) {
    return Math.round(v) + '%'
  }

  onGetCpuUsageList (code, err, data) {
    this.info.loading = false
    this.info.cpuName = ''
    this.info.maxCount = 0
    this.info.curCount = 0
    this.info.curPercent = this.fmtValue(0)

    const percents = []
    if (code === 0) {
      if (data) {
        this.info.cpuName = data.cpuName
        this.info.maxCount = data.maxCount
        const items = data.percents
        const c = items.length
        for (let i = 0; i < c; i++) {
          const item = items[i]
          percents.push(item.usage)
        }
      }
    } else {
      this.info.error.summary = err.summary
      this.info.error.detail = err.detail
    }

    this.info.items[0].data = percents
    this.info.curCount = percents.length
    if (this.info.curCount > 0) {
      this.info.curPercent = this.fmtValue(percents[this.info.curCount - 1])
    }
  }

  doGetCpuUsageList () {
    if (this.info.loading) {
      return
    }

    this.info.loading = true
    this.info.error.summary = ''
    this.info.error.detail = ''
    this.post(this.$uris.monitorCpuUsageList, null, this.onGetCpuUsageList)
  }

  onSocketMessage (id, data) {
    if (id !== this.$evt.id.wsCpuUsage) {
      return
    }
    if (this.info.curCount < 1) {
      return
    }

    this.info.curPercent = this.fmtValue(data.usage)
    this.info.items[0].data.push(data.usage)
    if (this.info.items[0].data.length > this.info.maxCount) {
      this.info.items[0].data.shift()
    }
  }

  mounted () {
    this.$nextTick(this.fireRoutePathChanged)
    this.doGetCpuUsageList()
  }
}

export default Index
</script>

<style scoped>
.trend {
  height: 300px;
}
</style>
