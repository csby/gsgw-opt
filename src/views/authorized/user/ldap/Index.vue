<template>
  <div>
    <ldapInfo :element-height="elementHeight"
              :get-uri="this.$uris.cfgOptLdapGet"
              :set-uri="this.$uris.cfgOptLdapSet" />
  </div>
</template>

<script>
import Component from 'vue-class-component'
import RoutingBase from '@/components/RoutingBase'
import LdapInfo from '@/components/user/ldap/Info'

@Component({
  components: {
    ldapInfo: LdapInfo
  }
})
class Index extends RoutingBase {
}

export default Index
</script>

<style scoped>

</style>
