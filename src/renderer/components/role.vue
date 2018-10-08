<template>
  <v-chip @click="open('/role/show/' + id)">
    <v-icon left>supervised_user_circle</v-icon>
    {{ role.rolename }}
  </v-chip>
</template>

<script>
import { getURL, get } from '../httphelper'

export default {
  name: 'role',
  props: {
    id: String
  },
  data () {
    return {
      role: {
        rolename: ''
      }
    }
  },
  async mounted () {
    if (this.id) {
      this.role.rolename = this.id
      try {
        const url = getURL(`/api/role/${this.id}/summary`, {})
        const role = await get(url)
        this.role = role
      } catch (e) {
        this.role.rolename = this.$t('error')
        this.$emit('update:valid', false)
      }
    } else {
      this.role.rolename = this.$t('error')
      this.$emit('update:valid', false)
    }
  },
  methods: {
    open (url) {
      window.open(url)
    }
  }
}
</script>
