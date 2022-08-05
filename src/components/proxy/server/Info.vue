<template>
  <el-collapse-item style="padding: 0px; margin: 0px;">
    <div slot="title" class="title">
      <div>
        <i class="el-icon-right"/>
        <span>转发端口: {{info.name}}</span>
        <el-badge class="badge" type="primary" :value="targetCount" />
      </div>
      <div class="title-info" v-show="info.ip.length > 0">
        <span>监听地址:{{info.ip}}</span>
      </div>
      <div class="title-info">
        <span>监听端口:{{info.port}}</span>
      </div>
      <div class="title-info">
        <span>已禁用:</span>
        <el-checkbox v-model="info.disable" :disabled="true" />
      </div>
      <div class="title-info" style="margin-right: 36px;">
        <span>TLS:</span>
        <el-checkbox v-model="info.tls" :disabled="true" />
      </div>
      <div>
        <el-tooltip placement="top">
          <div slot="content">
            <span>删除转发端口</span>
          </div>
          <el-popconfirm :title="'确定要删除该转发端口[' + info.name + ']吗？'"
                         style="margin: 0; padding: 0;"
                         @confirm="onDeleteServerConfirm">
            <el-button slot="reference" class="icon-btn" type="text" icon="el-icon-delete" @click.stop=""/>
          </el-popconfirm>
        </el-tooltip>
      </div>
      <div>
        <el-tooltip placement="top">
          <div slot="content">
            <span>修改转发端口</span>
          </div>
          <el-button class="icon-btn"
                     style="padding-top: 4px;"
                     type="text"
                     icon="el-icon-edit-outline"
                     @click.stop="onShowServerEditDlg"/>
        </el-tooltip>
      </div>
    </div>
    <div>
      <targetInfo :server-id="info.id" @targetCountChanged="onTargetCountChanged"/>

      <severEditDlg v-model="dialogsVisible.serverEdit"
                    :info="info"
                    :uri="this.$uris.proxyServerMod"/>
    </div>
  </el-collapse-item>
</template>

<script>
import Component from 'vue-class-component'
import SocketBase from '@/components/SocketBase'
import SeverEditDlg from '@/components/proxy/server/Edit'
import TargetInfo from '@/components/proxy/target/Info'

@Component({
  components: {
    severEditDlg: SeverEditDlg,
    targetInfo: TargetInfo
  },
  props: {
    info: {
      type: Object
    }
  }
})
class Info extends SocketBase {
  dialogsVisible = {
    serverEdit: false
  }

  targetCount = 0

  onDeleteServer (code, err, data) {
    if (code === 0) {
    } else {
      this.error(err)
    }
  }

  onDeleteServerConfirm () {
    if (this.info) {
      const argument = {
        id: this.info.id
      }

      this.post(this.$uris.proxyServerDel, argument, this.onDeleteServer)
    }
  }

  onTargetCountChanged (count) {
    this.targetCount = count
  }

  onShowServerEditDlg () {
    this.dialogsVisible.serverEdit = true
  }

  onSocketMessage (id, data) {
    if (id === this.$evt.id.wsReviseProxyServerMod) {
      if (data && this.info) {
        if (data.id === this.info.id) {
          this.info.name = data.name
          this.info.disable = data.disable
          this.info.tls = data.tls
          this.info.ip = data.ip
          this.info.port = data.port
        }
      }
    }
  }

  mounted () {
  }
}

export default Info
</script>

<style scoped>
  .title {
    width: 100%;
    display: flex;
    align-items: center;
    padding: 0px 10px 0px 20px;
    font-size: medium;
  }
  .title div {
    display: flex;
    align-items: center;
  }
  .title div:first-child {
    flex: 1;
  }
  .title /deep/ .el-checkbox {
   padding: 0;
  }
  .title div:first-child i {
    width: 30px;
    text-align: center;
  }

  .title-info {
    font-size: small;
    color: lightgray;
    padding-right: 15px;
  }

  .icon-btn {
    padding: 2px 5px;
    cursor: pointer;
  }

  .badge {
    margin-left: 5px;
  }
</style>
