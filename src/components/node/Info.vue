<template>
  <el-card :body-style="bodyStyle">
    <div slot="header" class="header">
      <div>
        <i class="el-icon-info" ></i>
        <span>节点信息</span>
      </div>
      <div >
        <el-tooltip placement="left">
          <div slot="content">
            <span>刷新</span>
          </div>
          <el-button style="padding: 2px 5px;" type="text" icon="el-icon-refresh" @click="doGetInfo"/>
        </el-tooltip>
      </div>
    </div>
    <div v-loading="info.loading" element-loading-text="加载中...">
      <div class="item">
        <span>节点实例:</span>
        <span class="text">{{info.instance}}</span>
      </div>
      <div class="item">
        <span>节点标识:</span>
        <span class="text">{{info.certificate}}</span>
      </div>
      <div class="item">
        <span>节点名称:</span>
        <span class="text">{{info.name}}</span>
      </div>
      <div class="item">
        <span>启用状态:</span>
        <span class="text" v-if="info.enabled">已启用</span>
        <span class="text" v-else style="color: #909399;">已禁用</span>
      </div>
      <div class="item">
        <span>云端地址:</span>
        <span class="text">{{info.cloudAddress}}</span>
      </div>
      <div class="item">
        <span>在线状态:</span>
        <span class="text" v-if="info.online" style="color: #67C23A;">在线</span>
        <span class="text" v-else style="color: #909399;">离线</span>
      </div>
    </div>
  </el-card>
</template>

<script>
import Component from 'vue-class-component'
import SocketBase from '@/components/SocketBase'

@Component
class Info extends SocketBase {
  bodyStyle = {
    padding: '6px 1px 9px 12px'
  }

  info = {
    loading: false,
    instance: '',
    certificate: '',
    name: '',
    enabled: false,
    cloudAddress: '',
    online: false
  }

  onGetInfo (code, err, data) {
    this.info.loading = false
    if (code === 0) {
      this.info.instance = data.instance
      this.info.certificate = data.certificate
      this.info.name = data.name
      this.info.enabled = data.enabled
      this.info.cloudAddress = data.cloudAddress
      this.info.online = data.online
    }
  }

  doGetInfo () {
    this.info.loading = true
    this.post(this.$uris.nodeInfoGet, null, this.onGetInfo)
  }

  onSocketMessage(id, data) {
    if (id === this.$evt.id.wsNodeOnlineStateChanged) {
      this.info.online = data.online
    }
  }

  mounted() {
    this.doGetInfo()
  }
}

export default Info
</script>

<style scoped>
  .el-card /deep/ .el-card__header {
    background-color: #f8f8f8;
    padding: 1px 3px;
  }
  .header {
    display: flex;
    align-items: center;
  }
  .header div {
    display: flex;
    align-items: center;
  }

  .header div:first-child {
    flex: 1;
  }
  .header div:first-child i {
    width: 30px;
    text-align: center;
  }

  .item {
    display: flex;
    align-items: center;
    font-size: 13px;
  }
  .item:not(:first-child) {
    margin-top: 5px;
  }

  .text {
    font-weight: bold;
    margin-left: 3px;
  }
</style>
