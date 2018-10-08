<template>
  <div>
    <template v-for="(value, i) in values">
      <v-input append-icon="delete" @click:append="values.splice(i, 1)" :messages="[$t('index_and_id', [i, value])]" :key="value">
        <file :id="value"/>
      </v-input>
    </template>
    <template v-if="formKind === 1">
      <v-autocomplete :loading="loading" :items="items" :search-input.sync="search" v-model="newItem" cache-items flat hide-no-data hide-details item-text="filename" item-value="_id" :label="$t('input_filename')">
        <template slot="item" slot-scope="data">
          <v-list-tile-content>
            <v-list-tile-title v-html="data.item.filename"></v-list-tile-title>
            <v-list-tile-sub-title v-html="data.item._id"></v-list-tile-sub-title>
          </v-list-tile-content>
        </template>
      </v-autocomplete>
      <v-btn color="primary" @click="values.push(newItem), formKind = 0" :disabled="!newItem || values.includes(newItem)" v-text="$t('ok')"/>
      <v-btn @click="formKind = 0" v-text="$t('cancel')"/>
      {{ $t('selected', [newItem]) }}
    </template>
    <template v-else-if="formKind === 2">
      <v-text-field v-model="file.filename" :label="$t('filename')"/>
      <v-text-field v-model="file.description" :label="$t('description')"/>
      <z-monaco-editor v-model="file.content" class="editor" :language="language"/>
      <v-select :items="languages" v-model="language" :label="$t('language')"></v-select>
      <v-btn color="primary" v-text="$t('submit')" @click="createFile"/>
      <v-btn @click="formKind = 0" v-text="$t('cancel')"/>
    </template>
    <template v-else-if="formKind === 3">
      <input type="file" id="file_upload" name="file_upload" multiple>
      <v-btn color="primary" @click="uploadFile" v-text="$t('upload')"/>
      <v-btn @click="formKind = 0" v-text="$t('cancel')"/>
    </template>
    <template v-else>
      <v-menu offset-y>
        <v-btn slot="activator" color="primary" v-text="$t('new')"/>
        <v-list>
          <v-list-tile @click="formKind = 1">
            <v-list-tile-title v-text="$t('select')"/>
          </v-list-tile>
          <v-list-tile @click="formKind = 2">
            <v-list-tile-title v-text="$t('editor')"/>
          </v-list-tile>
          <v-list-tile @click="formKind = 3">
            <v-list-tile-title v-text="$t('upload')"/>
          </v-list-tile>
        </v-list>
      </v-menu>
    </template>
  </div>
</template>

<script>
import { getURL, getPURL, get, post } from '../httphelper'
import file from './file'
import axios from 'axios'
import zMonacoEditor from './zMonacoEditor'
import { languages } from '../editor'

export default {
  name: 'zArrayEditor',
  props: ['values'],
  components: {
    file,
    zMonacoEditor
  },
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
      formKind: 0,
      file: {
        content: '',
        filename: '',
        description: 'No description'
      },
      language: 'plain',
      languages: languages
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
      const searchURL = getPURL('/api/file/list', { search: val }, 10, 1)
      const result = await get(searchURL)
      if (result instanceof Array) {
        this.items = result
      } else {
        this.items = []
      }
      this.loading = false
    },
    async uploadFile () {
      const files = document.getElementById('file_upload').files
      const url = getURL('/api/file/upload', {})
      for (let file of files) {
        let formData = new FormData()
        formData.append('file', file)
        const result = await axios.post(url, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        if (result.data.status === 'success') {
          this.values.push(result.data.payload)
        } else {
          //
        }
      }
      document.getElementById('file_upload').value = null
      this.formKind = 0
    },
    async createFile () {
      const url = getURL('/api/file/create', {})
      try {
        const id = await post(url, this.file)
        this.values.push(id)
      } catch (e) {
        //
      }
      this.file.filename = ''
      this.file.content = ''
      this.file.description = 'No description'
      this.formKind = 0
    }
  }
}
</script>

<style lang="stylus" scoped>
.editor
  height 500px
  width 100%
</style>
