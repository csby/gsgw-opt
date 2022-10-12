<template>
  <el-card :body-style="bodyStyle" shadow="never">
    <div slot="header" class="header">
      <div>
        <i class="el-icon-folder" ></i>
        <span>LDAP</span>
      </div>
      <div v-show="info.set.visible === false">
        <el-button style="padding: 0px 5px;" type="text" icon="el-icon-refresh" :loading="info.get.loading" @click="doGetInfo">
          <span>刷新</span>
        </el-button>
        <el-button style="padding: 0px 5px;" type="text" icon="el-icon-edit-outline" :loading="info.get.loading" @click="showEdit">
          <span>修改</span>
        </el-button>
      </div>
    </div>
    <div>
      <el-form label-width="auto" label-suffix=":" label-position="left" size="small" class="input-form">
        <el-form-item label="是否启用">
          <el-checkbox v-if="info.set.visible" v-model="info.set.args.enable" @change="onEditInput"/>
          <el-checkbox v-else v-model="info.get.info.enable" :disabled="true" />
        </el-form-item>
        <el-form-item label="服务地址">
          <el-input v-if="info.set.visible" v-model="info.set.args.host" @input="onEditInput"/>
          <el-input v-else v-model="info.get.info.host" :readonly="true" class="input-readonly" />
        </el-form-item>
        <el-form-item label="服务端口">
          <el-input-number v-if="info.set.visible" v-model="info.set.args.port"  controls-position="right" @change="onEditInput"/>
          <el-input-number v-else v-model="info.get.info.port" :readonly="true" class="input-readonly" :controls="false"/>
        </el-form-item>
        <el-form-item label="搜索路径">
          <el-input v-if="info.set.visible" v-model="info.set.args.base" placeholder="例如: dc=example,dc=com" @input="onEditInput"/>
          <el-input v-else v-model="info.get.info.base" :readonly="true" class="input-readonly" />
        </el-form-item>
      </el-form>
      <div v-show="info.set.visible">
        <errorMessage :code="info.set.error.code" :summary="info.set.error.summary" :detail="info.set.error.detail" />
        <div style="text-align: right; margin-top: 5px;">
          <el-button :disabled="info.set.submitting" @click="info.set.visible = false">取 消</el-button>
          <el-button type="primary" :disabled="info.set.disable" :loading="info.set.submitting" @click="doSetInfo">提 交</el-button>
        </div>
      </div>
    </div>
  </el-card>
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
    getUri: {
      type: String,
      default: ''
    },
    setUri: {
      type: String,
      default: ''
    }
  }
})
class Info extends VueBase {
  bodyStyle = {
    padding: '10px 20px'
  }

  info = {
    get: {
      loading: false,
      info: {
        enable: false,
        host: '127.0.0.1',
        port: 389,
        base: 'dc=example,dc=com'
      },
      error: {
        code: 0,
        summary: '',
        detail: ''
      }
    },
    set: {
      visible: false,
      submitting: false,
      disable: true,
      args: {
        enable: false,
        host: '127.0.0.1',
        port: 389,
        base: 'dc=example,dc=com'
      },
      error: {
        code: 0,
        summary: '',
        detail: ''
      }
    }
  }

  showEdit () {
    this.info.set.args.enable = this.info.get.info.enable
    this.info.set.args.host = this.info.get.info.host
    this.info.set.args.port = this.info.get.info.port
    this.info.set.args.base = this.info.get.info.base
    this.info.set.error.code = 0
    this.info.set.error.summary = ''
    this.info.set.error.detail = ''
    this.info.set.submitting = false
    this.info.set.disable = true
    this.info.set.visible = true
  }

  onEditInput () {
    this.info.set.error.code = 0
    this.info.set.disable = false

    if (this.info.set.args.enable !== this.info.get.info.enable) {
      return
    }
    if (this.info.set.args.host !== this.info.get.info.host) {
      return
    }
    if (this.info.set.args.port !== this.info.get.info.port) {
      return
    }
    if (this.info.set.args.base !== this.info.get.info.base) {
      return
    }

    this.info.set.disable = true
  }

  onSetInfo (code, err, data) {
    this.info.set.submitting = false
    this.info.set.error.code = code

    if (code === 0) {
      if (data > 0) {
        this.doGetInfo()
      }
      this.info.set.visible = false
    } else {
      this.info.set.error.summary = err.summary
      this.info.set.error.detail = err.detail
    }
  }

  doSetInfo () {
    const uri = this.setUri
    if (this.isNullOrEmpty(uri)) {
      return
    }

    if (this.info.set.submitting) {
      return
    }

    this.info.set.error.code = 0
    this.info.set.error.summary = ''
    this.info.set.error.detail = ''
    this.info.set.submitting = true
    this.post(uri, this.info.set.args, this.onSetInfo)
  }

  onGetInfo (code, err, data) {
    this.info.get.loading = false
    this.info.get.error.code = code

    if (code === 0) {
      this.info.get.info.enable = data.enable
      this.info.get.info.host = data.host
      this.info.get.info.port = data.port
      this.info.get.info.base = data.base
    } else {
      this.info.get.error.summary = err.summary
      this.info.get.error.detail = err.detail
    }
  }

  doGetInfo () {
    const uri = this.getUri
    if (this.isNullOrEmpty(uri)) {
      return
    }

    if (this.info.get.loading) {
      return
    }

    this.info.get.error.code = 0
    this.info.get.error.summary = ''
    this.info.get.error.detail = ''
    this.info.get.loading = true
    this.post(uri, null, this.onGetInfo)
  }

  mounted () {
    this.doGetInfo()
  }
}

export default Info
</script>

<style scoped>
.el-card :deep(.el-card__header) {
  background-color: #f8f8f8;
  padding: 2px 6px;
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

.input-form {

}
.input-form :deep(.el-input__inner) {
  text-align: left;
}
.input-form :deep(.el-form-item--mini.el-form-item, .el-form-item--small.el-form-item) {
  margin-bottom: 10px;
}

.input-readonly {
}
.input-readonly :deep(.el-input__inner) {
  padding: 0;
  border-width: 0;
  border-radius: 0;
  font-weight: bold;
}

</style>
