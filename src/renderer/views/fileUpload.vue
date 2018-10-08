<template>
  <v-container>
    <v-flex>
      <v-card>
        <v-progress-linear v-if="showProgressBar" indeterminate/>
        <v-card-text class="headline" v-text="$t('upload_file')"/>
        <v-card-text>
          <form id="uploader" enctype="multipart/form-data">
            <input type="file" id="file" name="file">
          </form>
        </v-card-text>
        <v-card-actions>
          <v-spacer/>
          <v-btn color="primary" v-text="$t('submit')" @click="submit"/>
        </v-card-actions>
      </v-card>
    </v-flex>
    <v-snackbar v-model="showSnackbar">
      {{ snackbarText }}
    </v-snackbar>
  </v-container>
</template>

<script>
import { getURL } from '../httphelper'
import axios from 'axios'

export default {
  name: 'fileUploadView',
  data () {
    return {
      showProgressBar: false,
      showSnackbar: false,
      snackbarText: ''
    }
  },
  methods: {
    async submit () {
      this.showProgressBar = true
      const form = document.getElementById('uploader')
      const formData = new FormData(form)
      const url = getURL('/api/file/upload', {})
      try {
        try {
          const id = (await axios.post(url, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          })).data.payload
          this.showProgressBar = false
          this.showSnackbar = true
          this.snackbarText = this.$t('upload_finished')
          this.$router.push('/file/show/' + id)
        } catch (e) {
          this.showProgressBar = false
          this.showSnackbar = true
          this.snackbarText = this.$t('upload_failed')
        }
      } catch (e) {
        this.showProgressBar = false
        this.showSnackbar = true
        this.snackbarText = this.$t('upload_failed')
      }
    }
  }
}
</script>
