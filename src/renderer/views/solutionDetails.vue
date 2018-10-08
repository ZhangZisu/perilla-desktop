<template>
  <v-container>
    <v-flex>
      <v-card>
        <v-progress-linear v-if="!loaded" indeterminate/>
        <v-card-title> 
          <div class="headline" v-text="$t('solution_details')"/>
          <v-spacer/>
          <v-btn v-text="$t('rejudge')" @click="rejudge"/>
          <v-btn color="primary" v-text="$t('refresh')" @click="fetch"/>
        </v-card-title>
        <v-card-text v-if="loaded">
          <v-list>
            <v-list-tile>
              <v-list-tile-content v-text="$t('id')"/>
              <v-list-tile-content class="align-end" v-text="solution._id"/>
            </v-list-tile>
            <v-list-tile>
              <v-list-tile-content v-text="$t('status')"/>
              <v-list-tile-content class="align-end" v-text="solution.status"/>
            </v-list-tile>
            <v-list-tile>
              <v-list-tile-content v-text="$t('owner')"/>
              <v-list-tile-content class="align-end">
                <user :id="solution.owner"/>
              </v-list-tile-content>
            </v-list-tile>
            <v-list-tile>
              <v-list-tile-content v-text="$t('problem')"/>
              <v-list-tile-content class="align-end">
                <problem :id="solution.problemID"/>
              </v-list-tile-content>
            </v-list-tile>
          </v-list>
          <z-json-viewer :value="solution.result" :key="`rv_${resultVersion}`"/>
          <v-divider/>
          <div class="subheading" v-text="$t('files')"/>
          <file v-for="(file, i) in solution.files" :key="i" :id="file"/>
          <v-divider/>
          <div class="subheading" v-text="$t('can_read')"/>
          <ace label v-for="ace in solution.allowedRead" :key="`ar_${ace}`" :id="ace"/>
          <v-divider/>
          <div class="subheading" v-text="$t('can_read_result')"/>
          <ace label v-for="ace in solution.allowedReadResult" :key="`ars_${ace}`" :id="ace"/>
          <v-divider/>
          <div class="subheading" v-text="$t('can_modify')"/>
          <ace label v-for="ace in solution.allowedModify" :key="`am_${ace}`" :id="ace"/>
          <v-divider/>
          <div class="subheading" v-text="$t('can_rejudge')"/>
          <ace label v-for="ace in solution.allowedRejudge" :key="`arj_${ace}`" :id="ace"/>
        </v-card-text>
        <v-card-actions>
          <v-spacer/>
          <v-btn color="accent" v-text="$t('delete')" @click="deleteSolution"/>
        </v-card-actions>
      </v-card>
    </v-flex>
    <v-snackbar v-model="showSnackbar">
      {{ snackbarText }}
    </v-snackbar>
  </v-container>
</template>

<script>
import { getURL, get, post, del } from '../httphelper'
import jsonEditor from '../components/jsonEditor'
import ace from '../components/ace'
import file from '../components/file'
import user from '../components/user'
import problem from '../components/problem'
import zJsonViewer from '../components/zJsonViewer'

export default {
  name: 'solutionDetailsView',
  components: {
    jsonEditor,
    ace,
    file,
    user,
    problem,
    zJsonViewer
  },
  props: {
    id: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      solution: {
        owner: '',
        problemID: '',
        files: [],
        status: '',
        result: null,
        meta: {},
        created: '',
        allowedRead: [],
        allowedReadResult: [],
        allowedRejudge: [],
        allowedModify: []
      },
      showSnackbar: false,
      snackbarText: '',
      loaded: false,
      parsedResult: [],
      resultVersion: 0
    }
  },
  async created () {
    const fetchURL = getURL(`/api/solution/${this.id}`)
    this.solution = await get(fetchURL)
    this.loaded = true
    this.loadResult()
  },
  methods: {
    async fetch () {
      this.loaded = false
      this.showSnackbar = true
      this.snackbarText = this.$t('fetching')
      const fetchURL = getURL(`/api/solution/${this.id}`)
      this.solution = await get(fetchURL)
      this.showSnackbar = true
      this.snackbarText = this.$t('fetched')
      this.loaded = true
      this.loadResult()
    },
    async rejudge () {
      const rejudgeURL = getURL(`/api/solution/${this.id}/rejudge`)
      try {
        await post(rejudgeURL)
        this.showSnackbar = true
        this.snackbarText = this.$t('rejudged')
      } catch (e) {
        //
      }
    },
    async loadResult () {
      this.solution.result = null
      const resultURL = getURL(`/api/solution/${this.id}/result`)
      try {
        this.solution.result = await get(resultURL)
        this.resultVersion++
      } catch (e) {
        //
      }
    },
    async deleteSolution () {
      if (confirm(this.$t('delete_solution_confirm', [this.solution._id]))) {
        const url = getURL(`/api/solution/${this.id}/`)
        try {
          await del(url)
          this.$router.push('/solution')
        } catch (e) {
          //
        }
      }
    }
  }
}
</script>
