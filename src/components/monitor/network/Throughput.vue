<template>
  <div>
    <div class="info">
      <div class="sent">
        <div>发送</div>
        <div class="info-speed">{{info.curSent}}</div>
      </div>
      <div class="recv">
        <div>接收</div>
        <div class="info-speed">{{info.curRecv}}</div>
      </div>
    </div>
    <div class="ip" v-if="info.ipV4.length > 1">
      <div>IPv4</div>
      <div class="val" v-if="ips">
        <div v-for="(item, index) in info.ipV4" :key="index">{{item}}</div>
      </div>
    </div>
    <trend-chart v-if="info.curCount > 0"
                 class="trend"
                 :grid="info.grid"
                 :labels="info.labels"
                 :datasets="info.items">
    </trend-chart>
  </div>
</template>

<script>
import Component from 'vue-class-component'
import SocketBase from '@/components/SocketBase'

@Component({
  props: {
    name: {
      type: String,
      default: ''
    },
    ips: {
      type: Array,
      default: null
    }
  }
})
class Throughput extends SocketBase {
  info = {
    loading: false,
    maxCount: 0,
    curCount: 0,
    curSent: '',
    curRecv: '',
    ipV4: [],
    labels: {
      xLabels: [],
      yLabels: 2,
      yLabelsTextFormatter: this.fmtValue
    },
    grid: {
      verticalLines: true,
      horizontalLines: true,
      horizontalLinesNumber: 5
    },
    items: [
      {
        data: [],
        smooth: false,
        fill: false,
        className: 'recv'
      },
      {
        data: [],
        smooth: false,
        fill: false,
        className: 'sent'
      }
    ],
    error: {
      summary: '',
      detail: ''
    }
  }

  unit = {
    kb: 1024,
    mb: 1024 * 1024,
    gb: 1024 * 1024 * 1024
  }

  fmtValue (v) {
    const u = this.unit
    if (v > u.gb) {
      const val = v / u.gb
      return val.toFixed(2) + 'Gbps'
    } else if (v > u.mb) {
      const val = v / u.mb
      return val.toFixed(1) + 'Mbps'
    } else {
      return Math.round(v / u.kb) + 'Kbps'
    }
  }

  onGetList (code, err, data) {
    this.info.loading = false
    this.info.maxCount = 0
    this.info.curCount = 0
    this.info.curRecv = ''
    this.info.curSent = ''

    const times = []
    const sents = []
    const recvs = []
    if (code === 0) {
      if (data) {
        this.info.maxCount = data.maxCount
        const flows = data.flows
        const c = flows.length
        for (let i = 0; i < c; i++) {
          const item = flows[i]
          times.push(item.time)
          sents.push(8 * item.bytesSpeedSent)
          recvs.push(8 * item.bytesSpeedRecv)
        }
      }
    } else {
      this.info.error.summary = err.summary
      this.info.error.detail = err.detail
    }

    this.info.items[0].data = recvs
    this.info.items[1].data = sents
    this.info.curCount = times.length
    if (this.info.curCount > 0) {
      this.info.curRecv = this.fmtValue(recvs[this.info.curCount - 1])
      this.info.curSent = this.fmtValue(sents[this.info.curCount - 1])
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
    this.post(this.$uris.monitorNetworkThroughputList, argument, this.onGetList)
  }

  onSocketMessage (id, data) {
    if (id !== this.$evt.id.wsNetworkThroughput) {
      return
    }
    if (data.name !== this.name) {
      return
    }
    if (this.info.curCount < 1) {
      return
    }

    this.info.curRecv = this.fmtValue(8 * data.flow.bytesSpeedRecv)
    this.info.curSent = this.fmtValue(8 * data.flow.bytesSpeedSent)
    this.info.items[0].data.push(8 * data.flow.bytesSpeedRecv)
    this.info.items[1].data.push(8 * data.flow.bytesSpeedSent)
    if (this.info.items[0].data.length > this.info.maxCount) {
      this.info.items[0].data.shift()
    }
    if (this.info.items[1].data.length > this.info.maxCount) {
      this.info.items[1].data.shift()
    }
  }

  mounted () {
    this.doGetList()
    this.sendSocketMessage(this.$evt.id.wsNetworkThroughput, true)
    if (this.ips) {
      const c = this.ips.length
      for (let i = 0; i < c; i++) {
        const ip = this.ips[i]
        if (ip.indexOf(':') === -1) {
          this.info.ipV4.push(ip)
        }
      }
    }
  }

  beforeDestroy () {
    this.sendSocketMessage(this.$evt.id.wsNetworkThroughput, false)
  }
}

export default Throughput
</script>

<style scoped>
  .info {
    position: absolute;
    color: #8c939d;
    top: 30px;
  }
  .info .sent {
    border-color: #f0c78a;
    border-style: dashed;
    border-width: 0px 0px 0px 2px;
    margin: 3px 5px;
    padding: 2px;
  }
  .info .recv {
    border-color: #cf9236;
    border-style: solid;
    border-width: 0px 0px 0px 2px;
    margin: 3px 5px;
    padding: 2px;
  }
  .info-speed {
    color: #2c3e50;
    font-weight: bold;
  }

  .ip {
    position: absolute;
    top: 0;
    right: 0;
  }
  .ip .val {
    border-color: gray;
    border-style: dashed;
    border-width: 1px 0px 1px 0px;
    padding: 2px 5px;
  }

  .trend {
    height: 200px;
  }
</style>
