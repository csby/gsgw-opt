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
             :default-active="defaultActive">
      <el-menu-item index="/">
        <i class="el-icon-menu"></i>
        <span slot="title">服务面板</span>
      </el-menu-item>
      <el-menu-item index="/cloud" v-show="info.role.server.cloud">
        <i class="el-icon-cloudy"></i>
        <span slot="title">云端服务</span>
      </el-menu-item>
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
    minHeight: {
      type: Number,
      default: 100
    },
    defaultActive: {
      type: String,
      default: ''
    }
  }
})
class Catalog extends VueBase {
  menuCollapse = false

  info = {
    role: {
      server: {
        cloud: false,
        node: false
      }
    }
  }

  get heightStyle () {
    const minHeight = (this.minHeight - 25) + 'px'
    return {
      'min-height': minHeight
    }
  }

  onGetServerRole (code, err, data) {
    if (code === 0) {
      this.info.role.server.cloud = data.cloud
      this.info.role.server.node = data.node
    } else {
    }
  }

  doGetServerRole () {
    this.post(this.$uris.sysRoleServer, null, this.onGetServerRole)
  }

  mounted() {
    this.doGetServerRole()
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
