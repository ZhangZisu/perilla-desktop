<template>
  <v-container>
    <v-flex>
      <v-card>
        <v-progress-linear indeterminate query v-if="loading"/>
        <v-card-title class="headline" v-text="$t('edit_file')"/>
        <v-card-text v-if="!loading">
          <div class="subheading" v-text="$t('basic')"/>
          <v-text-field v-model="file.filename" :label="$t('filename')"/>
          <v-textarea v-model="file.description" :label="$t('description')"/>
          <!-- Access Control -->
          <div class="subheading" v-text="$t('can_read')"/>
          <v-divider/>
          <z-access-control-editor v-model="file.allowedRead"/>
          <div class="subheading" v-text="$t('can_modify')"/>
          <v-divider/>
          <z-access-control-editor v-model="file.allowedModify"/>
          <!-- Editor -->
          <template v-if="loadedEditor">
            <z-monaco-editor v-model="fileContent" :language="fileLanguage" class="editor"/>
            <v-btn v-text="$t('update')" color="primary" @click="updateContent"/>
          </template>
          <template v-else>
            <v-btn v-text="$t('load_editor')" color="primary" @click="loadEditor"/>
          </template>
        </v-card-text>
        <v-card-actions>
          <v-spacer/>
          <v-btn v-text="$t('cancel')" @click="$router.go(-1)"/>
          <v-btn color="primary" v-text="$t('save')" @click="save"/>
        </v-card-actions>
      </v-card>
    </v-flex>
  </v-container>
</template>

<script>
import { getURL, get, post } from '../httphelper'
import zAccessControlEditor from '../components/zAccessControlEditor'
import zMonacoEditor from '../components/zMonacoEditor'
import axios from 'axios'

const modes = {
  c: 'c',
  cpp: 'cpp',
  cc: 'cpp',
  js: 'javascript',
  java: 'java',
  md: 'markdown'
}

const esmateFileType = filename => {
  let p = null
  if ((p = filename.lastIndexOf('.')) !== -1) {
    let ext = filename.substring(p + 1, filename.length)
    return modes[ext.toLowerCase()] || 'plain'
  } else {
    return 'plain'
  }
}

export default {
  name: 'fileEditView',
  components: {
    zAccessControlEditor,
    zMonacoEditor
  },
  props: {
    fileID: String
  },
  data () {
    return {
      file: {
        _id: '',
        hash: '',
        size: 0,
        owner: '',
        description: '',
        filename: '',
        created: '',
        allowedRead: [],
        allowedModify: []
      },
      loading: true,
      loadedEditor: false,
      fileContent: null,
      fileLanguage: null
    }
  },
  async mounted () {
    const url = getURL(`/api/file/${this.fileID}`, {})
    this.file = await get(url)
    this.loading = false
  },
  methods: {
    async save () {
      this.loading = true
      const url = getURL(`/api/file/${this.fileID}`, {})
      try {
        await post(url, this.file)
        this.$router.push(`/file/show/${this.fileID}`)
      } catch (e) {
        //
      }
      this.loading = false
    },
    async loadEditor () {
      if (confirm(this.$t('load_file_editor_confirm'))) {
        try {
          const rawURL = getURL(`/api/file/${this.fileID}/raw`, {})
          const res = await axios.get(rawURL, { responseType: 'text' })
          this.fileContent = res.data
          this.fileLanguage = esmateFileType(this.file.filename)
          this.loadedEditor = true
        } catch (e) {
          //
        }
      }
    },
    async updateContent () {
      const rawUpdateURL = getURL(`/api/file/${this.fileID}/raw`, {})
      try {
        await post(rawUpdateURL, { content: this.fileContent })
        this.$router.push(`/file/show/${this.fileID}`)
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
