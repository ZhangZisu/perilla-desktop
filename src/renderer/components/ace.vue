<template>
  <v-chip @click="open(link)">
    <v-icon left v-if="ace.type === 'role'">supervised_user_circle</v-icon>
    <v-icon left v-else-if="ace.type === 'user'">account_circle</v-icon>
    <v-icon left v-else>error</v-icon>
    {{ ace.name }}
  </v-chip>
</template>

<script>
import { getURL, get } from '../httphelper'

export default {
  name: 'ace',
  props: {
    id: String
  },
  data () {
    return {
      ace: {
        name: '',
        type: ''
      }
    }
  },
  async mounted () {
    if (this.id) {
      this.ace.name = this.id
      try {
        const url = getURL(`/api/ace/${this.id}`, {})
        this.ace = await get(url)
      } catch (e) {
        this.ace.name = this.$t('error')
        this.$emit('update:valid', false)
      }
    } else {
      this.ace.name = this.$t('error')
      this.$emit('update:valid', false)
    }
  },
  computed: {
    link () {
      return '/' + this.ace.type + '/show/' + this.id
    }
  },
  methods: {
    open (url) {
      window.open(url)
    }
  }
}
</script>
