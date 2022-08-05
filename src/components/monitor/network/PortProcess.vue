<template>
  <el-popover width="420" placement="left" @show="onShow">
    <div class="root">
      <div class="header">
        <i class="el-icon-s-tools" />
        <div>进程信息</div>
        <div style="flex: 1;" />
        <el-button type="text" icon="el-icon-refresh" :loading="info.loading" @click="doGetInfo" />
      </div>
      <div>
        <div class="row">
          <div>监听端口:</div>
          <div>{{address}}:{{port}}/{{protocol}}</div>
        </div>
        <div class="row">
          <div>进程ID:</div>
          <div>{{pid}}</div>
        </div>
        <div class="row">
          <div>进程名称:</div>
          <div>{{info.data.name}}</div>
        </div>
        <div class="row">
          <div>程序路径:</div>
          <div>{{info.data.exe}}</div>
        </div>
      </div>
      <div>
        <el-alert v-show="info.error.code !== 0"
                  type="error"
                  :closable="false"
                  :title="info.error.summary"
                  :description="info.error.detail" />
      </div>
    </div>
    <el-button slot="reference" type="text" style="padding: 0;">
      <span>{{pid}}</span>
    </el-button>
  </el-popover>
</template>

<script>
import Component from 'vue-class-component'
import VueBase from '@/components/VueBase'

@Component ({
  props: {
    pid: {
      type: Number,
      default: 0
    },
    port: {
      type: Number,
      default: 0
    },
    address: {
      type: String,
      default: ''
    },
    protocol: {
      type: String,
      default: ''
    }
  }
})
class PortProcess extends VueBase {
  info = {
    loading: false,
    data: {
      name: '',
      exe: ''
    },
    error: {
      code: 0,
      summary: '',
      detail: ''
    }
  }

  onShow () {
    this.doGetInfo()
  }

  onGetInfo (code, err, data) {
    this.info.loading = false
    this.info.error.code = code

    if (code === 0) {
      this.info.data.name = data.name
      this.info.data.exe = data.exe
    } else {
      this.info.error.summary = err.summary
      this.info.error.detail = err.detail
    }
  }

  doGetInfo () {
    if (this.info.loading) {
      return
    }

    const argument = {
      pid: this.pid
    }

    this.info.loading = true
    this.info.data.name = ''
    this.info.data.exe = ''
    this.info.error.code = 0
    this.info.error.summary = ''
    this.info.error.detail = ''
    this.post(this.$uris.monitorProcessInfo, argument, this.onGetInfo)
  }

}

export default PortProcess
</script>

<style scoped>
  .root {
    border-style: solid;
    border-width: 1px;
    border-color: #DCDFE6;
    border-radius: 3px;
    padding-bottom: 5px;
  }

  .header {
    display: flex;
    align-items: center;
    background-color: #f8f8f8;
    padding: 6px;
  }
  .header i {
    margin-right: 5px;
  }
  .header .el-button {
    padding: 0;
    margin-right: 5px;
  }

  .row {
    display: flex;
    align-items: start;
    padding: 5px 3px 0px 0px;
  }
  .row :first-child {
    font-weight: lighter;
    padding-right: 5px;
    width: 65px;
    min-width: 65px;
    text-align: right;
  }
</style>
