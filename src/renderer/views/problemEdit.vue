<template>
  <v-container>
    <v-flex>
      <v-card>
        <v-progress-linear indeterminate query v-if="showProgressBar"/>
        <v-card-title class="headline" v-text="$t('edit_problem')"/>
        <v-card-text v-if="loaded">
          <v-text-field :label="$t('title')" v-model="problem.title"/>
          <z-markdown-editor v-model="problem.content"/>
          <v-combobox v-model="problem.tags" :label="$t('tags')" hide-selected multiple chips clearable/>
          <v-divider/>
          <div class="headline" v-text="$t('files')"/>
          <z-file-editor v-model="problem.files"/>
          <div class="headline" v-text="$t('data_config')"/>
          <v-menu offset-y>
            <v-btn slot="activator" color="primary" v-text="$t('auto_generate')" />
            <v-list>
              <v-list-tile @click="generateTraditional">
                <v-list-tile-title v-text="$t('traditional')" />
              </v-list-tile>
              <v-list-tile @click="generateDirect">
                <v-list-tile-title v-text="$t('direct')" />
              </v-list-tile>
              <v-list-tile @click="generateVirtual">
                <v-list-tile-title v-text="$t('virtual')" />
              </v-list-tile>
            </v-list>
          </v-menu>
          <json-editor v-model="problem.data" :valid.sync="dataValid"/>
          <v-divider/>
          <div class="headline" v-text="$t('meta')"/>
          <json-editor v-model="problem.meta" :valid.sync="metaValid"/>
          <!-- Access Control -->
          <template v-if="id">
            <div class="headline" v-text="$t('can_read')"/>
            <v-divider/>
            <z-access-control-editor v-model="problem.allowedRead"/>
            <div class="headline" v-text="$t('can_modify')"/>
            <v-divider/>
            <z-access-control-editor v-model="problem.allowedModify"/>
            <div class="headline" v-text="$t('can_submit')"/>
            <v-divider/>
            <z-access-control-editor v-model="problem.allowedSubmit"/>
          </template>
        </v-card-text>
        <v-card-actions>
          <v-spacer/>
          <v-btn v-text="$t('return')" @click="$router.push(`/problem/show/${problem._id}`)" v-if="id"/>
          <v-btn color="primary" v-text="$t('save')" @click="save"/>
        </v-card-actions>
      </v-card>
    </v-flex>
    <v-snackbar v-model="showSnackbar">
      {{ snackbarText }}
    </v-snackbar>
  </v-container>
</template>

<script>
import { getURL, post, get } from '../httphelper'
import jsonEditor from '../components/jsonEditor'
import zAccessControlEditor from '../components/zAccessControlEditor'
import zFileEditor from '../components/zFileEditor'
import zMarkdownEditor from '../components/zMarkdownEditor'
import file from '../components/file'

const programExts = ['c', 'cpp', 'java', 'js']
const testcaseExts = ['in', 'out', 'ans']

export default {
  name: 'problemEditView',
  components: {
    jsonEditor,
    zAccessControlEditor,
    zFileEditor,
    zMarkdownEditor,
    file
  },
  props: {
    id: String
  },
  data () {
    return {
      problem: {
        title: '',
        content: '',
        data: {
          version: '1.0'
        },
        meta: {
          version: '1.0'
        },
        tags: [],
        files: [],
        allowedRead: [],
        allowedModify: [],
        allowedSubmit: []
      },
      showProgressBar: false,
      loaded: false,
      showSnackbar: false,
      snackbarText: '',
      dataValid: true,
      metaValid: true
    }
  },
  async created () {
    if (this.id) {
      const fetchURL = getURL(`/api/problem/${this.id}`, {})
      this.problem = await get(fetchURL)
      this.$store.commit(
        'updateTitle',
        this.$t('title_problem_edit', [this.problem.title])
      )
    } else {
      this.$store.commit('updateTitle', this.$t('new_problem'))
    }
    this.loaded = true
  },
  methods: {
    async save () {
      if (!this.dataValid) {
        this.showSnackbar = true
        this.snackbarText = this.$t('invalid', [this.$t('data')])
        return
      }
      if (!this.metaValid) {
        this.showSnackbar = true
        this.snackbarText = this.$t('invalid', [this.$t('meta')])
        return
      }
      this.showProgressBar = true
      let updateURL = null
      if (this.id) {
        updateURL = getURL(`/api/problem/${this.id}`, {})
      } else {
        updateURL = getURL(`/api/problem/new`, {})
      }
      const result = await post(updateURL, this.problem)
      this.showProgressBar = false
      if (!this.id) {
        this.$router.push(`/problem/edit/${result}`)
      } else {
        this.showSnackbar = true
        this.snackbarText = this.$t('problem_updated')
        this.loaded = false
        const fetchURL = getURL(`/api/problem/${this.id}`, {})
        this.problem = await get(fetchURL)
        this.loaded = true
      }
    },
    async generateDirect () {
      this.problem.data = {
        version: '1.0',
        type: 'direct',
        judgerFile: 0,
        testcases: []
      }
    },
    async generateTraditional () {
      try {
        this.showSnackbar = true
        this.snackbarText = this.$t('fetching_file_info')
        let esmated = {}
        let judgerFile = 0
        for (let i in this.problem.files) {
          const file = this.problem.files[i]
          const url = getURL(`/api/file/${file}/summary`, {})
          const result = await get(url)
          const filename = result.filename
          const fullname = filename.substring(0, filename.lastIndexOf('.'))
          const extname = filename.substring(
            filename.lastIndexOf('.') + 1,
            filename.length
          )
          if (testcaseExts.includes(extname)) {
            if (!esmated[fullname]) esmated[fullname] = {}
            esmated[fullname][extname] = i
          }
          if (programExts.includes(extname)) {
            judgerFile = i
          }
        }
        const subtaskmap = {}
        let count = 0
        for (let name in esmated) {
          const pos = name.indexOf('_')
          const subtaskname = ~pos ? name.substring(0, pos) : '_default_'
          if (!subtaskmap[subtaskname]) {
            subtaskmap[subtaskname] = []
            count++
          }
          subtaskmap[subtaskname].push({
            input: esmated[name]['in'],
            output: esmated[name]['out'] || esmated[name]['ans']
          })
        }
        const subtasks = []
        for (let name in subtaskmap) {
          subtasks.push({
            name,
            score: 100 / count,
            testcases: subtaskmap[name],
            autoSkip: true,
            timeLimit: 1000,
            memoryLimit: 512 * 1024 * 1024
          })
        }
        this.problem.data = {
          version: '1.0',
          type: 'traditional',
          judgerFile,
          subtasks
        }
      } catch (e) {
        this.showSnackbar = true
        this.snackbarText = e.message
      }
    },
    async generateVirtual () {
      if (confirm(this.$t('this_operation_will_rewrite_data'))) {
        const origin = prompt(this.$t('remote_oj'))
        const problemID = prompt(this.$t('remote_problem_id'))
        this.problem.data = {
          version: '1.0',
          type: 'virtual',
          origin,
          problemID
        }
      }
    }
  }
}
</script>
