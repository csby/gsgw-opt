<script>
import Component from 'vue-class-component'
import VueBase from '@/components/VueBase'

@Component
class RoutingBase extends VueBase {
  mounted () {
    this.$nextTick(this.fireRoutePathChanged)
  }
}

export default RoutingBase
</script>
