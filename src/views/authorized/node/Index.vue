<template>
  <div>
    <nodeInfo />
    <fwdInfo style="margin-top: 10px;" />
  </div>
</template>

<script>
import Component from 'vue-class-component'
import VueBase from '@/components/VueBase'
import NodeInfo from '@/components/node/Info'
import FwdInfo from '@/components/node/fwd/Info'

@Component({
  components: {
    nodeInfo: NodeInfo,
    fwdInfo: FwdInfo
  }
})
class Index extends VueBase {
}

export default Index
</script>

<style scoped>

</style>
