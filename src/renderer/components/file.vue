<template>
  <v-chip @click="open('/file/show/' + id)">
    <v-icon left>folder</v-icon>
    {{ file.filename }}
  </v-chip>
</template>

<script>
import { getURL, get } from '../httphelper'

export default {
  name: 'file',
  props: {
    id: String
  },
  data () {
    return {
      file: {
        filename: ''
      }
    }
  },
  async mounted () {
    if (this.id) {
      this.file.filename = this.id
      try {
        const url = getURL(`/api/file/${this.id}/summary`, {})
        const file = await get(url)
        this.file = file
      } catch (e) {
        this.file.filename = this.$t('error')
        this.$emit('update:valid', false)
      }
    } else {
      this.file.filename = this.$t('error')
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
