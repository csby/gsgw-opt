<template>
  <el-card :body-style="bodyStyle" shadow="never">
    <div slot="header" class="header">
      <div>
        <i class="el-icon-share" />
        <span>转发服务</span>
        <el-badge class="badge" type="info" :value="servers.length" />
      </div>
      <div>
        <el-tooltip placement="left">
          <div slot="content">
            <span>刷新</span>
          </div>
          <el-button class="icon-btn" type="text" icon="el-icon-refresh" :loading="loadings.servers" @click="getServers"/>
        </el-tooltip>
      </div>
      <div>
        <el-tooltip placement="top">
          <div slot="content">
            <span>添加转发端口</span>
          </div>
          <el-button class="icon-btn" type="text" icon="el-icon-circle-plus-outline" @click="dialogsVisible.serverAdd = true"/>
        </el-tooltip>
      </div>
      <div>
        <el-tooltip placement="top">
          <div slot="content">
            <span>修改服务配置</span>
          </div>
          <el-button class="icon-btn" type="text" icon="el-icon-edit-outline" @click="onShowSvcSettingEditDlg"/>
        </el-tooltip>
      </div>
      <div>
        <el-tooltip placement="right">
          <div slot="content">
            <div>
              <span style="font-weight: bold;">{{svcStatuses[svcStatus.status]}}</span>
            </div>
            <div v-if="svcStatus.status === 2">
              <span>启动时间: {{svcStatus.startTime}}</span>
            </div>
            <div v-if="svcStatus.status === 0" style="margin-top: 5px; color: red;">
              <span v-show="svcStatus.error.length > 0">错误信息: {{svcStatus.error}}</span>
            </div>
          </div>
          <el-dropdown trigger="click">
            <span class="icon-btn" style="padding: 0px;">
              <i v-show="svcStatus.status === 0" class="el-icon-video-pause" style="color: #f00000"/>
              <i v-show="svcStatus.status === 1" class="el-icon-loading" style="color: #0000f0"/>
              <i v-show="svcStatus.status === 2" class="el-icon-video-play" style="color: #00f000"/>
              <i v-show="svcStatus.status === 3" class="el-icon-loading" style="color: #0000f0"/>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item v-if="svcStatus.status === 0">
                <el-button type="text" @click="startService" :disabled="srvSetting.disable">启动</el-button>
              </el-dropdown-item>
              <el-dropdown-item v-if="svcStatus.status === 2">
                <el-button type="text" @click="restartService" :disabled="srvSetting.disable">重启</el-button>
              </el-dropdown-item>
              <el-dropdown-item v-if="svcStatus.status === 2">
                <el-button type="text" @click="stopService" :disabled="srvSetting.disable">停止</el-button>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-tooltip>
      </div>
    </div>

    <div>
      <div style="padding: 4px 0px 4px 50px; font-size: small;background-color: #fcfcfc;">
        <span style="padding-right: 5px;">已禁用:</span>
        <el-checkbox v-model="srvSetting.disable" :disabled="true"/>
      </div>
      <el-collapse>
        <serverInfo v-for="(item, index) in servers" :key="index" :info="item"/>
      </el-collapse>
    </div>

    <el-dialog title="修改服务配置"
               width="300px"
               :visible.sync="dialogsVisible.svcSettingEdit"
               :append-to-body="true"
               :close-on-click-modal="false">
      <div>
        <div>
          <span style="padding-right: 5px;">已禁用:</span>
          <el-checkbox v-model="srvSettingEdit.disable"/>
        </div>
        <errorMessage style="margin-top: 8px;" :summary="srvSettingEditErr.summary" :detail="srvSettingEditErr.detail" :holder="false"/>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogsVisible.svcSettingEdit = false">取 消</el-button>
        <el-button type="primary" @click="onSvcSettingEdit">确 定</el-button>
      </span>
    </el-dialog>

    <severAddDlg title="添加转发端口"
                 v-model="dialogsVisible.serverAdd"
                 :uri="this.$uris.proxyServerAdd"/>
  </el-card>
</template>

<script>
import Component from 'vue-class-component'
import SocketBase from '@/components/SocketBase'
import ErrorMessage from '@/components/Error'
import ServerInfo from '@/components/proxy/server/Info'
import SeverAddDlg from '@/components/proxy/server/Edit'

@Component({
  components: {
    errorMessage: ErrorMessage,
    serverInfo: ServerInfo,
    severAddDlg: SeverAddDlg
  }
})
class Service extends SocketBase {
  bodyStyle = {
    padding: '0px 0px 0px 0px'
  }

  loadings = {
    servers: false
  }

  dialogsVisible = {
    svcSettingEdit: false,
    serverAdd: false
  }

  srvSetting = {
    disable: false
  }

  srvSettingEdit = {
    disable: false
  }

  srvSettingEditErr = {
    summary: '',
    detail: ''
  }

  svcStatus = {
    status: 0,
    startTime: null,
    error: ''
  }

  svcStatuses = [
    '已停止',
    '启动中',
    '运行中',
    '停止中'
  ]

  servers = []

  onGetServers (code, err, data) {
    this.loadings.servers = false
    if (code === 0) {
      this.servers = data
    } else {
      this.servers = []
    }
  }

  getServers () {
    this.loadings.servers = true
    this.post(this.$uris.proxyServerList, null, this.onGetServers)
  }

  onServiceOpt (code, err, data) {
    if (code === 0) {
    } else {
      this.error(err)
    }
  }

  startService () {
    this.post(this.$uris.proxyServiceStart, null, this.onServiceOpt)
  }

  stopService () {
    this.post(this.$uris.proxyServiceStop, null, this.onServiceOpt)
  }

  restartService () {
    this.post(this.$uris.proxyServiceRestart, null, this.onServiceOpt)
  }

  onGetServiceStatus (code, err, data) {
    if (code === 0) {
      this.svcStatus.status = data.status
      this.svcStatus.startTime = data.startTime
      this.svcStatus.error = data.error
    }
  }

  getServiceStatus () {
    this.post(this.$uris.proxyServiceStatus, null, this.onGetServiceStatus)
  }

  onShowSvcSettingEditDlg () {
    this.srvSettingEdit.disable = this.srvSetting.disable
    this.dialogsVisible.svcSettingEdit = true
  }

  onSvcSettingEdit () {
    this.srvSettingEditErr.summary = ''
    this.srvSettingEditErr.detail = ''
    this.setServiceSetting(this.srvSettingEdit)
  }

  onSetServiceSetting (code, err, data) {
    if (code === 0) {
      this.srvSetting.disable = data.disable
      this.dialogsVisible.svcSettingEdit = false
    } else {
      this.srvSettingEditErr.summary = err.summary
      this.srvSettingEditErr.detail = err.detail
    }
  }

  setServiceSetting (data) {
    this.post(this.$uris.proxyServiceSettingSet, data, this.onSetServiceSetting)
  }

  onGetServiceSetting (code, err, data) {
    if (code === 0) {
      this.srvSetting.disable = data.disable
    } else {
      this.srvSetting.disable = false
    }
  }

  getServiceSetting () {
    this.post(this.$uris.proxyServiceSettingGet, null, this.onGetServiceSetting)
  }

  onSocketMessage (id, data) {
    if (id === this.$evt.id.wsReviseProxyServiceStatus) {
      if (data) {
        this.svcStatus.status = data.status
        this.svcStatus.startTime = data.startTime
        this.svcStatus.error = data.error
      }
    } else if (id === this.$evt.id.wsReviseProxyServerAdd) {
      if (data && this.servers) {
        this.servers.push(data)
      }
    } else if (id === this.$evt.id.wsReviseProxyServerDel) {
      if (data && this.servers) {
        const count = this.servers.length
        for (let index = 0; index < count; index++) {
          if (data.id === this.servers[index].id) {
            this.servers.splice(index, 1)
            break
          }
        }
      }
    }
  }

  mounted () {
    this.getServiceSetting()
    this.getServiceStatus()
    this.getServers()
  }
}

export default Service
</script>

<style scoped>
.el-card /deep/ .el-card__header {
  background-color: #f8f8f8;
  padding: 3px;
}

el-collapse /deep/ .el-collapse-item__header {
  background-color: #00f000;
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

.icon-btn {
  padding: 2px 5px;
  cursor: pointer;
}

.badge {
  margin-left: 5px;
}
</style>
