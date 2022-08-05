<template>
  <div>
    <div class="header">
      <i :class="icon"></i>
      <span>{{title}}</span>
      <el-badge class="badge" type="info" :value="itemCount" v-if="itemCount > 0"/>
      <slot name="info" />
      <div>
        <slot name="button" :action="doGetList"/>
        <el-button v-show="isNotNullOrEmpty(uri)"
                   type="text"
                   icon="el-icon-refresh"
                   :loading="info.loading"
                   @click="doGetList">刷新</el-button>
      </div>
    </div>
    <div class="table" v-show="isNotNullOrEmpty(uri)">
      <el-table v-loading="info.loading"
                aelement-loading-text="加载中..."
                element-loading-spinner="el-icon-loading"
                size="small"
                :row-class-name="tableRowClass"
                :max-height="heights.client - heights.top - heights.head"
                :data="info.items"
                :border="true"
                :stripe="true">
        <slot :client="heights.client"
              :top="heights.top"
              :head="heights.head"
              :action="doGetList"/>
        <template slot="empty">
            <span v-if="isError" class="error">
                <i class="el-icon-error"></i>
                <div class="error-summary">{{error.summary}}</div>
                <div class="error-detail">{{error.detail}}</div>
            </span>
          <span v-else>暂无数据</span>
        </template>
      </el-table>
    </div>
    <div>
      <slot name="custom"
            :client="heights.client"
            :top="heights.top"
            :head="heights.head"/>
    </div>
  </div>
</template>

<script>
import Component from 'vue-class-component'
import VueBase from '@/components/VueBase'
import TableList from '@/components/TableList'

@Component({
  components: {
    tableList: TableList
  },
  props: {
    icon: {
      type: String,
      default: 'el-icon-monitor'
    },
    title: {
      type: String,
      default: ''
    },
    uri: {
      type: String,
      default: ''
    },
    argument: {
      type: Object,
      default: null
    },
    tableRowClass: {
      type: Function,
      default: function ({ row, rowIndex }) {
        return ''
      }
    },
    filter: {
      type: Function,
      default: function (data) {
        return true
      }
    }
  }
})
class Page extends VueBase {
  info = {
    loading: false,
    items: [],
    error: {
      summary: '',
      detail: ''
    }
  }

  heights = {
    client: (window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight) - 1,
    top: 30,
    head: 25
  }

  get itemCount () {
    if (this.info.items) {
      return this.info.items.length
    } else {
      return 0
    }
  }

  get isError () {
    if (this.isNotNullOrEmpty(this.info.error.summary) || this.isNotNullOrEmpty(this.info.error.detail)) {
      return true
    } else {
      return false
    }
  }

  onSizeChanged () {
    const clientHeight = window.innerHeight ||
        document.documentElement.clientHeight ||
        document.body.clientHeight

    const paddingHeight = 1
    this.heights.client = clientHeight - paddingHeight
  }

  onGetList (code, err, data) {
    this.info.loading = false
    const items = []
    if (code === 0) {
      if (data) {
        const filter = this.filter
        const c = data.length
        for (let i = 0; i < c; i++) {
          const item = data[i]
          if (filter) {
            if (filter(item)) {
              items.push(item)
            }
          } else {
            items.push(item)
          }
        }
      }
    } else {
      this.info.error.summary = err.summary
      this.info.error.detail = err.detail
    }
    this.info.items = items
  }

  doGetList () {
    const uri = this.uri
    if (this.isNullOrEmpty(uri)) {
      return
    }
    if (this.info.loading) {
      return
    }

    this.info.loading = true
    this.info.error.summary = ''
    this.info.error.detail = ''
    this.post(uri, this.argument, this.onGetList)
  }

  mounted () {
    this.doGetList()
    window.addEventListener('resize', this.onSizeChanged)
    this.onSizeChanged()
  }

  beforeDestroy () {
    window.removeEventListener('resize', this.onSizeChanged)
  }
}

export default Page
</script>

<style scoped>
.header {
  display: flex;
  align-items: center;
  height: 25px;
  padding: 0px 8px;
  background-color: #f8f8f8;
}
.header /deep/ .el-button {
  padding: 0px 2px;
  margin-top: 0px;
  margin-bottom: 0px;
}
.header :not(:first-child) {
  margin-left: 3px;
}
.header i:first-child {
  margin-top: 2px;
}
.header div:last-child {
  flex: 1;
  text-align: right;
}
.header div:last-child :not(:last-child){
  margin-right: 5px;
}
.badge {
  padding: 0;
  margin-top: 3px;
}

.table {
}
.table /deep/ .el-table th.el-table__cell {
  padding: 2px 0px;
  margin: 0;
}
.table /deep/ .el-table--small td {
  padding: 0;
  margin: 0;
}
.table /deep/ .el-button {
  padding: 1px 8px 0px 0px;
  margin: 0;
}
</style>
