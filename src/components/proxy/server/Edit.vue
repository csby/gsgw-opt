<template>
  <el-dialog :visible.sync="visible"
             :title="title"
             width="500px"
             :append-to-body="true"
             :close-on-click-modal="false"
             @closed="handleInput(false)">
    <table class="table">
      <tr>
        <td class="required">名称:</td>
        <td>
          <el-input v-model="editInfo.name" placeholder="请输入端口转发名称，如：https" type="text" size="mini"/>
        </td>
      </tr>
      <tr>
        <td class="required">监听端口:</td>
        <td>
          <el-input v-model="editInfo.port" placeholder="有效范围从1到65535" type="text" size="mini"/>
        </td>
      </tr>
      <tr>
        <td>监听地址:</td>
        <td>
          <el-input v-model="editInfo.ip" placeholder="空表示所有可用IP" type="text" size="mini"/>
        </td>
      </tr>
      <tr>
        <td>已禁用:</td>
        <td>
          <el-checkbox v-model="editInfo.disable" style="padding: 5px 0px" />
        </td>
      </tr>
      <tr>
        <td>TLS:</td>
        <td>
          <el-checkbox v-model="editInfo.tls" tyle="padding: 5px 0px"/>
        </td>
      </tr>
      <tr>
        <td></td>
        <td>
          <error-message :summary="errSummary" :detail="errDetail" :holder="false"/>
        </td>
      </tr>
    </table>

    <span slot="footer">
        <el-button size="small" @click="visible = false">关 闭</el-button>
        <el-button size="small" type="primary" :loading="saving" :disabled="saving" @click="save">保 存</el-button>
    </span>
  </el-dialog>
</template>

<script>
import Component from 'vue-class-component'
import VueBase from '@/components/VueBase'
import ErrorMessage from '@/components/Error'

@Component({
  components: {
    errorMessage: ErrorMessage
  },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: '修改转发端口'
    },
    uri: {
      type: String,
      default: ''
    },
    info: {
      type: Object
    }
  },
  watch: {
    value: {
      handler: 'onVisibleChanged'
    }
  }
})
class Edit extends VueBase {
  errSummary = ''
  errDetail = ''
  visible = false
  saving = false

  editInfo = {
    id: '',
    name: '',
    disable: false,
    tls: false,
    ip: '',
    port: ''
  }

  onSave (code, err, data) {
    this.saving = false
    if (code === 0) {
      this.visible = false
    } else {
      this.errSummary = err.summary
      this.errDetail = err.detail
    }
  }

  save () {
    this.errSummary = ''
    this.errDetail = ''
    this.saving = true
    const uri = this.uri
    this.post(uri, this.editInfo, this.onSave)
  }

  handleInput (value) {
    this.$emit('input', value)
  }

  onVisibleChanged (val) {
    this.visible = val
    if (val) {
      this.saving = false
      if (this.info) {
        this.editInfo.id = this.info.id
        this.editInfo.name = this.info.name
        this.editInfo.disable = this.info.disable
        this.editInfo.tls = this.info.tls
        this.editInfo.ip = this.info.ip
        this.editInfo.port = this.info.port
      } else {
        this.editInfo.id = ''
        this.editInfo.name = ''
        this.editInfo.disable = false
        this.editInfo.tls = false
        this.editInfo.ip = ''
        this.editInfo.port = ''
      }
    } else {
      this.errSummary = ''
      this.errDetail = ''
    }
  }
}

export default Edit
</script>

<style scoped>
.table {
  padding: 0px;
  width: 100%;
}

.table tr td:first-child {
  text-align: right;
  padding-right: 5px;
  width: 75px;
}

.required {
  color: #f00000;
}
</style>
