<template>
  <div>
    <allNode />
  </div>
</template>

<script>
import Component from 'vue-class-component'
import VueBase from '@/components/VueBase'
import AllNode from '@/components/cloud/node/All'
import OnlineNode from '@/components/cloud/node/Online'

@Component({
  components: {
    allNode: AllNode,
    onlineNode: OnlineNode
  }
})
class Index extends VueBase {
}

export default Index
</script>

<style scoped>

</style>
