<template>
  <userList :element-height="elementHeight" />
</template>

<script>
import Component from 'vue-class-component'
import RoutingBase from '@/components/RoutingBase'
import UserList from '@/components/user/local/UserList'

@Component({
  components: {
    userList: UserList
  }
})
class Index extends RoutingBase {
}

export default Index
</script>

<style scoped>

</style>
