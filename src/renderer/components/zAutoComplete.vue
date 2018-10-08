<template>
  <v-autocomplete :loading="loading" :items="items" :search-input.sync="search" v-model="lazyValue" cache-items flat hide-no-data hide-details :item-text="textProp" item-value="_id" :label="hint" chips :multiple="multiple">
    <template slot="selection" slot-scope="data">
      <v-chip close @input="remove(data.item._id)">{{ data.item[textProp] }}</v-chip>
    </template>
    <template slot="item" slot-scope="data">
      <v-list-tile-content>
        <v-list-tile-title v-html="data.item[textProp]"></v-list-tile-title>
        <v-list-tile-sub-title v-html="data.item._id"></v-list-tile-sub-title>
      </v-list-tile-content>
    </template>
  </v-autocomplete>
</template>

<script>
import { getPURL, get } from '../httphelper'

export default {
  name: 'zAutoComplete',
  props: ['value', 'textProp', 'hint', 'queryUrl', 'multiple'],
  model: {
    prop: 'value',
    event: 'change'
  },
  data () {
    return {
      loading: false,
      items: [],
      search: '',
      lazyValue: null
    }
  },
  created () {
    this.lazyValue = this.value
  },
  watch: {
    search (val) {
      val && this.querySelections(val)
    },
    lazyValue (val) {
      this.$emit('change', val)
    }
  },
  methods: {
    async querySelections (val) {
      this.loading = true
      const searchURL = getPURL(this.queryUrl, { search: val }, 10, 1)
      const result = await get(searchURL)
      if (result instanceof Array) {
        this.items = result
      } else {
        this.items = []
      }
      this.loading = false
    },
    remove (item) {
      if (this.multiple !== undefined) {
        const index = this.lazyValue.indexOf(item)
        if (index >= 0) this.lazyValue.splice(index, 1)
      } else {
        this.lazyValue = null
      }
    }
  }
}
</script>
