<template>
  <v-chip @click="open('/problem/show/' + id)">
    <v-icon left>notes</v-icon>
    {{ problem.title }}
  </v-chip>
</template>

<script>
import { getURL, get } from '../httphelper'

export default {
  name: 'problem',
  props: {
    id: String
  },
  data () {
    return {
      problem: {
        title: ''
      }
    }
  },
  async created () {
    if (this.id) {
      this.problem.title = this.id
      try {
        const url = getURL(`/api/problem/${this.id}/summary`, {})
        const problem = await get(url)
        this.problem = problem
      } catch (e) {
        this.problem.title = this.$t('error')
        this.$emit('update:valid', false)
      }
    } else {
      this.problem.title = this.$t('error')
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
