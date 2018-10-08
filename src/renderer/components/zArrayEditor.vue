<template>
  <div>
    <template v-for="(value, i) in values">
      <v-input append-icon="delete" @click:append="values.splice(i, 1)" :messages="[value]" :key="value">
        <slot name="items" :value="value">
          {{ value }}
        </slot>
      </v-input>
    </template>
    <template v-if="showAddForm">
      <v-autocomplete :loading="loading" :items="items" :search-input.sync="search" v-model="newItem" cache-items flat hide-no-data hide-details :item-text="textProp" item-value="_id" :label="hint">
        <template slot="item" slot-scope="data">
          <v-list-tile-content>
            <v-list-tile-title v-html="data.item[textProp]"></v-list-tile-title>
            <v-list-tile-sub-title v-html="data.item._id"></v-list-tile-sub-title>
          </v-list-tile-content>
        </template>
      </v-autocomplete>
      <v-btn color="primary" @click="values.push(newItem), showAddForm = false" :disabled="!newItem || values.includes(newItem)" v-text="$t('ok')"/>
      <v-btn @click="showAddForm = false" v-text="$t('cancel')"/>
      {{ $t('selected', [newItem]) }}
    </template>
    <template v-else>
      <v-btn color="primary" @click="showAddForm = true" v-text="$t('add')"/>
    </template>
  </div>
</template>

<script>
import { getPURL, get } from '../httphelper'

export default {
  name: 'zArrayEditor',
  props: ['values', 'textProp', 'hint', 'queryURL'],
  model: {
    prop: 'values',
    event: 'updateValues'
  },
  data () {
    return {
      loading: false,
      items: [],
      search: '',
      newItem: null,
      showAddForm: false
    }
  },
  watch: {
    search (val) {
      val && this.querySelections(val)
    },
    values (val) {
      this.$emit('updateValues', val)
    }
  },
  methods: {
    async querySelections (val) {
      this.loading = true
      const searchURL = getPURL(this.queryURL, { search: val }, 10, 1)
      const result = await get(searchURL)
      if (result instanceof Array) {
        this.items = result
      } else {
        this.items = []
      }
      this.loading = false
    }
  }
}
</script>
