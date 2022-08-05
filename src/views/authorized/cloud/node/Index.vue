<template>
  <div>
    <allNode />
  </div>
</template>

<script>
import Component from 'vue-class-component'
import RoutingBase from '@/components/RoutingBase'
import AllNode from '@/components/cloud/node/All'
import OnlineNode from '@/components/cloud/node/Online'

@Component({
  components: {
    allNode: AllNode,
    onlineNode: OnlineNode
  }
})
class Index extends RoutingBase {
}

export default Index
</script>

<style scoped>

</style>
