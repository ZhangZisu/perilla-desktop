<template>
  <div>
    <template v-for="(value, i) in values">
      <v-input append-icon="delete" @click:append="values.splice(i, 1)" :messages="[value]" :key="value">
        <ace :id="value"/>
      </v-input>
    </template>
    <template v-if="showAddForm">
      <v-autocomplete :loading="loading" :items="items" :search-input.sync="search" v-model="newItem" cache-items flat hide-no-data hide-details item-text="name" item-value="id" :label="$t('choose_user_or_role')" chips>
        <template slot="selection" slot-scope="data">
          <v-chip>
            <v-icon left v-if="data.item.type === 'role'">supervised_user_circle</v-icon>
            <v-icon left v-else>account_circle</v-icon>
            {{ data.item.name }}
          </v-chip>
        </template>
        <template slot="item" slot-scope="data">
          <v-list-tile-avatar>
            <v-icon v-if="data.item.type === 'role'">supervised_user_circle</v-icon>
            <v-icon v-else>account_circle</v-icon>
          </v-list-tile-avatar>
          <v-list-tile-content>
            <v-list-tile-title v-html="data.item.name"></v-list-tile-title>
            <v-list-tile-sub-title v-html="data.item._id"></v-list-tile-sub-title>
          </v-list-tile-content>
        </template>
      </v-autocomplete>
      <v-btn color="primary" @click="values.push(newItem),showAddForm = false" :disabled="!newItem || values.includes(newItem)" v-text="$t('ok')"/>
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
import ace from './ace'

export default {
  name: 'zArrayEditor',
  components: {
    ace
  },
  props: ['values'],
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
      const searchURL = getPURL('/api/ace', { search: val }, 10, 1)
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
