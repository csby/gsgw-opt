<template>
  <div class="navigation">
    <div class="btn" @click="menuCollapse = !menuCollapse">
      <span v-if="menuCollapse" class="icon">
          <i class="el-icon-s-unfold" />
      </span>
      <span v-else class="icon">
          <i class="el-icon-s-data" />
      </span>
    </div>

    <el-menu class="menu" :style="heightStyle"
             :collapse="menuCollapse"
             :router="true"
             :default-active="activeIndex">
      <el-menu-item index="/">
        <i class="el-icon-menu"></i>
        <span slot="title">服务面板</span>
      </el-menu-item>

      <el-submenu index="/user">
        <template slot="title">
          <i class="el-icon-user-solid"></i>
          <span slot="title">用户管理</span>
        </template>
        <el-menu-item index="/user/local">
          <i class="el-icon-user"></i>
          <span slot="title">本地用户</span>
        </el-menu-item>
        <el-menu-item index="/user/online">
          <i class="el-icon-s-check"></i>
          <span slot="title">在线用户</span>
        </el-menu-item>
        <el-menu-item index="/user/ldap">
          <i class="el-icon-folder"></i>
          <span slot="title">LDAP</span>
        </el-menu-item>
      </el-submenu>

      <el-submenu index="/monitor/disk/partition">
        <template slot="title">
          <i class="el-icon-monitor"></i>
          <span>系统资源</span>
        </template>
        <el-menu-item index="/monitor/disk/partition">
          <i class="el-icon-coin"></i>
          <span slot="title">磁盘</span>
        </el-menu-item>
        <el-menu-item index="/monitor/network/interface">
          <i class="el-icon-set-up"></i>
          <span slot="title">网络</span>
        </el-menu-item>
        <el-menu-item index="/monitor/cpu/usage">
          <i class="el-icon-cpu"></i>
          <span slot="title">处理器</span>
        </el-menu-item>
        <el-menu-item index="/monitor/mem/usage">
          <i class="el-icon-notebook-2"></i>
          <span slot="title">内存</span>
        </el-menu-item>
      </el-submenu>

      <el-submenu index="/svc/custom" v-show="info.role.server.service">
        <template slot="title">
          <i class="el-icon-s-tools"></i>
          <span>系统服务</span>
        </template>
        <el-menu-item index="/svc/tomcat">
          <i class="el-icon-setting"></i>
          <span slot="title">tomcat</span>
        </el-menu-item>
        <el-menu-item index="/svc/nginx">
          <i class="el-icon-setting"></i>
          <span slot="title">nginx</span>
        </el-menu-item>
        <el-menu-item index="/svc/custom">
          <i class="el-icon-setting"></i>
          <span slot="title">自定义</span>
        </el-menu-item>
        <el-menu-item index="/svc/other">
          <i class="el-icon-setting"></i>
          <span slot="title">其他</span>
        </el-menu-item>
      </el-submenu>

      <el-menu-item index="/port/fwd/proxy" v-show="info.role.server.proxy">
        <i class="el-icon-share"></i>
        <span slot="title">方向代理</span>
      </el-menu-item>

      <el-submenu index="/cloud" v-show="info.role.server.cloud">
        <template slot="title">
          <i class="el-icon-cloudy"></i>
          <span slot="title">云端服务</span>
        </template>
        <el-menu-item index="/cloud/node">
          <i class="el-icon-place"></i>
          <span slot="title">节点信息</span>
        </el-menu-item>
        <el-menu-item index="/cloud/fwd">
          <i class="el-icon-sort"></i>
          <span slot="title">转发连接</span>
        </el-menu-item>
      </el-submenu>

      <el-menu-item index="/node" v-show="info.role.server.node">
        <i class="el-icon-place"></i>
        <span slot="title">节点服务</span>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script>
import Component from 'vue-class-component'
import VueBase from '@/components/VueBase'

@Component({
  props: {
    defaultActive: {
      type: String,
      default: ''
    }
  }
})
class Catalog extends VueBase {
  menuCollapse = false
  activeIndex = ''

  info = {
    role: {
      server: {
        cloud: false,
        node: false,
        service: false,
        proxy: false
      }
    }
  }

  get heightStyle () {
    const minHeight = (this.elementHeight - 25) + 'px'
    return {
      'min-height': minHeight
    }
  }

  onRoutingPathChanged (path) {
    this.activeIndex = path
  }

  onGetServerRole (code, err, data) {
    if (code === 0) {
      this.info.role.server.cloud = data.cloud
      this.info.role.server.node = data.node
      this.info.role.server.service = data.service
      this.info.role.server.proxy = data.proxy
    } else {
    }
  }

  doGetServerRole () {
    this.post(this.$uris.sysRoleServer, null, this.onGetServerRole)
  }

  mounted() {
    this.activeIndex = this.defaultActive
    this.$evt.on(this.$evt.local.routing, this.onRoutingPathChanged)
    this.doGetServerRole()
  }

  beforeDestroy () {
    this.$evt.off(this.$evt.local.routing, this.onRoutingPathChanged)
  }
}

export default Catalog
</script>

<style scoped>
.navigation {
}

.navigation .btn {
  display: flex;
  align-items: center;
  height: 25px;
  background-color: #f8f8f8;
  border-right: 1px solid #e6e6e6;
  cursor: pointer;
}

.navigation .menu {
}
.navigation .menu:not(.el-menu--collapse) {
  width: 200px;
}

</style>
