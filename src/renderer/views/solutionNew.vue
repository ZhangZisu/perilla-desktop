<template>
  <v-container>
    <v-flex>
      <v-card>
        <v-progress-linear v-if="showProgressBar" indeterminate/>
        <v-card-title class="headline" v-text="$t('new_solution')"/>
        <v-card-text>
          <v-text-field :label="$t('problem_id')" v-model="problemID" readonly/>
          <z-file-editor v-model="files"/>
        </v-card-text>
        <v-card-actions>
          <v-spacer/>
          <v-btn depressed color="primary" v-text="$t('submit')" @click="submit" :disabled="!files.length"/>
        </v-card-actions>
      </v-card>
    </v-flex>
    <v-snackbar v-model="showSnackbar">
      {{ snackbarText }}
    </v-snackbar>
  </v-container>
</template>

<script>
import { getURL, post } from '../httphelper'
import file from '../components/file'
import zFileEditor from '../components/zFileEditor'

export default {
  name: 'solutionNewView',
  components: {
    file,
    zFileEditor
  },
  props: {
    problemID: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      files: [],
      showProgressBar: false,
      loaded: false,
      showSnackbar: false,
      snackbarText: ''
    }
  },
  methods: {
    async submit () {
      this.showProgressBar = true
      const submitURL = getURL('/api/solution/new', {})
      const form = { files: this.files, problemID: this.problemID }
      const solutionID = await post(submitURL, form)
      this.showSnackbar = true
      this.snackbarText = this.$t('solution_created')
      this.$router.push(`/solution/show/${solutionID}`)
    }
  }
}
</script>
