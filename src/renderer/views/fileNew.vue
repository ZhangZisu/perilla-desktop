<template>
  <v-container>
    <v-flex>
      <v-card>
        <v-progress-linear v-if="loading" indeterminate/>
        <v-card-text class="headline" v-text="$t('create_file')"/>
        <v-card-text>
          <v-text-field v-model="file.filename" :label="$t('filename')"/>
          <v-text-field v-model="file.description" :label="$t('description')"/>
          <z-monaco-editor class="editor" v-model="file.content" :language="language"/>
        </v-card-text>
        <v-card-actions>
          <v-select :items="languages" v-model="language" :label="$t('language')"></v-select>
          <v-spacer/>
          <v-btn color="primary" v-text="$t('submit')" @click="submit"/>
        </v-card-actions>
      </v-card>
    </v-flex>
  </v-container>
</template>

<script>
import { getURL, post } from '../httphelper'
import zMonacoEditor from '../components/zMonacoEditor'
import { languages } from '../editor'

export default {
  name: 'fileNewView',
  components: {
    zMonacoEditor
  },
  props: ['filename', 'description'],
  data () {
    return {
      file: {
        content: '',
        filename: '',
        description: ''
      },
      loading: false,
      language: 'plain',
      languages: languages
    }
  },
  created () {
    this.file.filename =
      this.filename || 'untitled ' + new Date().toLocaleString()
    this.file.description = this.description || 'No description'
  },
  methods: {
    async submit () {
      const url = getURL('/api/file/create', {})
      try {
        const id = await post(url, this.file)
        this.$router.push('/file/show/' + id)
      } catch (e) {
        //
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
.editor
  height 500px
  width 100%
</style>
