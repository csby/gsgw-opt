<template>
  <el-card :body-style="bodyStyle" shadow="never">
    <div slot="header" class="header">
      <div>
        <i class="el-icon-sort" />
        <span>转发连接</span>
        <el-badge class="badge" type="info" :value="items.length" />
      </div>
      <div>
        <el-tooltip placement="top">
          <div slot="content">
            <span>保持记录</span>
          </div>
          <el-checkbox class="icon-btn" v-model="hold" @change="onHoldChanged"/>
        </el-tooltip>
      </div>
      <div>
        <el-tooltip placement="top">
          <div slot="content">
            <span>刷新</span>
          </div>
          <el-button class="icon-btn" type="text" icon="el-icon-refresh" :loading="isSearching" @click="doSearch"/>
        </el-tooltip>
      </div>
    </div>

    <div>
      <div class="filter">
        <el-input type="text" size="mini" :clearable="true" @input="doSearch"
                  v-model="linkFilter.domain"
                  placeholder="可输入域名进行过滤">
          <template slot="prepend">域名</template>
        </el-input>
        <el-input type="text" size="mini" :clearable="true" @input="doSearch"
                  v-model="linkFilter.listenAddr"
                  placeholder="可输入监听地址进行过滤">
          <template slot="prepend">监听地址</template>
        </el-input>
        <el-input type="text" size="mini" :clearable="true" @input="doSearch"
                  v-model="linkFilter.targetAddr"
                  placeholder="可输入目标地址进行过滤">
          <template slot="prepend">目标地址</template>
        </el-input>
      </div>
      <el-table v-loading="isSearching"
                aelement-loading-text="加载中..."
                element-loading-spinner="el-icon-loading"
                size="small"
                width="100%"
                :row-class-name="tableRowClassName"
                :max-height="360"
                :data="items"
                :border="true"
                :stripe="true">
        <el-table-column prop="time" label="连接开始时间" width="140"/>
        <el-table-column prop="sourceAddr" label="传入地址" width="160" align="right"/>
        <el-table-column prop="targetAddr" label="目标地址" width="200"/>
        <el-table-column prop="domain" label="域名" align="right"/>
        <el-table-column prop="listenAddr" label="监听地址" width="160"/>
        <template slot="empty">
          <span v-if="isError" class="error">
              <i class="el-icon-error"></i>
              <div class="error-summary">{{errSummary}}</div>
              <div class="error-detail">{{errDetail}}</div>
          </span>
          <span v-else>当前没有正在进行转发的连接</span>
        </template>
      </el-table>
    </div>
  </el-card>
</template>

<script>
import Component from 'vue-class-component'
import SocketBase from '@/components/SocketBase'

@Component
class Connection extends SocketBase {
  bodyStyle = {
    padding: '0px 0px 0px 0px'
  }

  errSummary = ''
  errDetail = ''
  isError = false
  isSearching = false

  linkFilter = {
    listenAddr: '',
    domain: '',
    targetAddr: ''
  }

  hold = false
  items = []

  tableRowClassName ({ row, rowIndex }) {
    if (row.status === 1) {
      return 'error-row'
    }

    return ''
  }

  onHoldChanged (val) {
    if (val) {
      return
    }

    this.doSearch()
  }

  onSearched (code, err, data) {
    this.isSearching = false

    if (code === 0) {
      this.isError = false
      this.items = data
    } else if (code !== 101) {
      this.isError = true
      this.errSummary = err.summary
      this.errDetail = err.detail
      this.items = []
    }
  }

  doSearch () {
    this.isError = false
    this.isSearching = true
    this.post(this.$uris.proxyConnList, this.linkFilter, this.onSearched)
  }

  onSocketMessage (id, data) {
    if (id === this.$evt.id.wsReviseProxyConnectionOpen) {
      if (data && this.items) {
        let valid = true
        if (this.linkFilter.targetAddr.length > 0) {
          if (data.targetAddr.indexOf(this.linkFilter.targetAddr) === -1) {
            valid = false
          }
        }
        if (valid && this.linkFilter.domain.length > 0) {
          if (data.domain.indexOf(this.linkFilter.domain) === -1) {
            valid = false
          }
        }
        if (valid && this.linkFilter.listenAddr.length > 0) {
          if (data.listenAddr.indexOf(this.linkFilter.listenAddr) === -1) {
            valid = false
          }
        }

        if (valid) {
          if (this.hold) {
            this.items.push(data)
          } else {
            this.items.unshift(data)
          }
        }
      }
    } else if (id === this.$evt.id.wsReviseProxyConnectionShut) {
      if (data && this.items) {
        const count = this.items.length
        for (let index = 0; index < count; index++) {
          const item = this.items[index]
          if (item) {
            if (data.id === item.id) {
              if (this.hold) {
                item.status = 1
              } else {
                this.items.splice(index, 1)
              }
              break
            }
          }
        }
      }
    }
  }

  mounted () {
    this.doSearch()
  }
}

export default Connection
</script>

<style scoped>
  .el-card :deep(.el-card__header) {
    background-color: #f8f8f8;
    padding: 3px;
  }
  .el-card :deep(.el-table--small td) {
    padding: 1px 0px;
    margin: 0;
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

  .filter {
    display: flex;
    align-items: center;
    padding: 0px;
    margin: 0px;
  }
  .filter .el-input:not(:first-child){
    margin-left: 10px;
  }
</style>
