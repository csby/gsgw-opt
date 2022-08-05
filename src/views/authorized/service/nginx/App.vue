<template>
  <el-card :body-style="bodyStyle">
    <div slot="header" class="header">
      <div>
        <span>虚拟站点</span>
        <el-badge class="badge" type="primary" :value="items.length" v-if="items.length > 0"/></div>
      <div>
      </div>
    </div>
    <el-table size="small"
              :data="items"
              :border="true"
              :stripe="true">
      <el-table-column
          label="站点名称"
          prop="name"
          width="115px"/>
      <el-table-column
          label="物理路径"
          prop="root"/>
      <el-table-column
          label="访问地址">
        <template slot-scope="scope">
          <div v-for="(url, index) in scope.row.urls" :key="index">
            <a :href="url" target="_blank">{{url}}</a>
          </div>
        </template>
      </el-table-column>
      <el-table-column
          label="版本号"
          prop="version"
          width="95px"/>
      <el-table-column
          label="发布时间"
          prop="deployTime"
          width="135px" />
      <el-table-column width="90px">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="showModDlg(scope.row)">更新</el-button>
          <el-button type="text" size="small" @click="showDetailDlg(scope.row)">详情</el-button>
        </template>
      </el-table-column>
    </el-table>

    <fileUpload v-model="mod.visible"
                width="580px"
                labelWidth="80px"
                title="上传并更新站点程序"
                accept=".war, .zip, .tar, .gz"
                :forms="mod.forms"
                :uri="mod.uri">
      <el-form-item label="服务名称">
        <el-input v-model="mod.forms[0].value" :readonly="true"/>
      </el-form-item>
      <el-form-item label="站点名称">
        <el-input v-model="mod.forms[1].value" :readonly="true"/>
      </el-form-item>
    </fileUpload>

    <fileDetail v-model="detail.visible"
                title="站点详情"
                :uri="detail.uri"
                :argument="detail.args" />
  </el-card>
</template>

<script>
import Component from 'vue-class-component'
import VueBase from '@/components/VueBase'
import FileUpload from '@/components/dlg/FileUpload'
import FileDetail from '@/components/svc/Detail'

@Component({
  components: {
    fileUpload: FileUpload,
    fileDetail: FileDetail
  },
  props: {
    service: {
      type: String,
      default: ''
    },
    items: {
      type: Array,
      default: function () {
        return []
      }
    }
  }
})
class App extends VueBase {
  bodyStyle = {
    padding: '0px 0px 0px 0px'
  }

  mod = {
    visible: false,
    uri: this.$uris.svcNginxAppMod,
    forms: [
      {
        name: 'svcName',
        value: ''
      },
      {
        name: 'appName',
        value: ''
      }
    ]
  }

  detail = {
    visible: false,
    uri: this.$uris.svcNginxAppDetail,
    args: {
      svcName: '',
      appName: ''
    }
  }

  showModDlg (location) {
    if (!location) {
      return
    }

    this.mod.forms[0].value = this.service
    this.mod.forms[1].value = location.name
    this.mod.visible = true
  }

  showDetailDlg (location) {
    if (!location) {
      return
    }

    this.detail.args.svcName = this.service
    this.detail.args.appName = location.name
    this.detail.visible = true
  }
}

export default App
</script>

<style scoped>
  .el-card /deep/ .el-card__header {
    background-color: #f8f8f8;
    padding: 6px;
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
</style>
