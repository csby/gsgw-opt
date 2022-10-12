<template>
  <div class="header">
    <img class="logo" alt="logo" src="../../assets/logo.png"  @click="to('/')"/>
    <div class="title">
      <div>{{frontTitle}}</div>
      <div class="version">{{frontVersion}}</div>
    </div>
    <div class="menu"/>
    <LoginUser />
  </div>
</template>

<script>
import Component from 'vue-class-component'
import VueBase from '@/components/VueBase'
import Config from '@/config'
import Version from '@/version'
import LoginUser from '@/components/auth/LoginUser'

@Component({
  components: {
    LoginUser
  }
})
class Header extends VueBase {
  frontVersion = Version.version
  frontTitle = Config.app.title
}

export default Header
</script>

<style scoped>
  .header {
    display: flex;
    align-items: center;
    height: 30px;
    padding: 0 5px 0 1px;
  }
  .header .logo {
    height: 60%;
    cursor: pointer;
  }
  .header .logo:hover {
    color: #409eff;
  }
  .header .title {
    display: flex;
    align-items: center;
    padding-left: 5px;
    font-size: medium;
  }
  .header .title .version {
    padding: 5px 0px 0px 2px;
    font-size: x-small;
    color: lightgray;
  }
  .header .menu {
    flex: 1;
    display: flex;
    align-items: center;
  }
</style>
