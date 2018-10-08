<template>
  <v-chip @click="open('/user/show/' + id)">
    <v-icon left>account_circle</v-icon>
    {{ user.username }}
  </v-chip>
</template>

<script>
import { getURL, get } from '../httphelper'

export default {
  name: 'user',
  props: {
    id: String
  },
  data () {
    return {
      user: {
        username: ''
      }
    }
  },
  async created () {
    if (this.id) {
      this.user.username = this.id
      try {
        const url = getURL(`/api/user/${this.id}/summary`, {})
        const user = await get(url)
        this.user = user
      } catch (e) {
        this.user.username = this.$t('error')
        this.$emit('update:valid', false)
      }
    } else {
      this.user.username = this.$t('error')
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
