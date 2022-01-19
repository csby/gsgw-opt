<template>
  <div>
    <fwdConn />
  </div>
</template>

<script>
import Component from 'vue-class-component'
import VueBase from '@/components/VueBase'
import FwdConn from '@/components/cloud/fwd/Connection'

@Component({
  components: {
    fwdConn: FwdConn
  }
})
class Index extends VueBase {
}

export default Index
</script>

<style scoped>

</style>
