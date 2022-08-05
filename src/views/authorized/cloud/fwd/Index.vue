<template>
  <div>
    <fwdConn />
  </div>
</template>

<script>
import Component from 'vue-class-component'
import RoutingBase from '@/components/RoutingBase'
import FwdConn from '@/components/cloud/fwd/Connection'

@Component({
  components: {
    fwdConn: FwdConn
  }
})
class Index extends RoutingBase {
}

export default Index
</script>

<style scoped>

</style>
