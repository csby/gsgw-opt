<template>
  <div class="page">
    <proxyService />
    <proxyConnection style="margin-top: 10px;" />
  </div>
</template>

<script>
import Component from 'vue-class-component'
import SocketBase from '@/components/SocketBase'
import ProxyService from '@/components/proxy/Service'
import ProxyConnection from '@/components/proxy/Connection'

@Component({
  components: {
    proxyService: ProxyService,
    proxyConnection: ProxyConnection
  }
})
class Index extends SocketBase {
  mounted () {
    this.$nextTick(this.fireRoutePathChanged)
  }
}

export default Index
</script>

<style scoped>
</style>
