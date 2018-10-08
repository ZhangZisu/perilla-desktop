<template>
  <v-container>
    <v-card>
      <v-progress-linear v-if="loading" indeterminate query/>
      <v-card-title class="headline" v-text="$t('edit_role')"/>
      <v-card-text v-if="!loading">
        <v-form v-model="form">
          <v-text-field v-model="role.rolename" :label="$t('rolename')" :rules="[notEmpty]"/>
          <v-text-field v-model="role.description" :label="$t('description')" :rules="[notEmpty]"/>
          <json-editor v-if="!loading && this.roleID" v-model="role.config" :valid.sync="valid"/>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer/>
        <v-btn v-text="$t('cancel')" @click="$router.push(-1)"/>
          <v-btn color="primary" v-text="$t('save')" @click="save" :disabled="loading || !valid || !form"/>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script>
import jsonEditor from '../components/jsonEditor'
import { getURL, get, post } from '../httphelper'

export default {
  name: 'roleDetails',
  components: {
    jsonEditor
  },
  props: {
    roleID: String
  },
  data () {
    return {
      role: {
        _id: '',
        rolename: '',
        description: '',
        config: {}
      },
      loading: true,
      valid: true,
      form: true
    }
  },
  async mounted () {
    if (this.roleID) {
      const url = getURL(`/api/role/${this.roleID}`)
      this.role = await get(url)
    }
    this.loading = false
  },
  methods: {
    async save () {
      this.loading = true
      try {
        if (this.roleID) {
          const url = getURL(`/api/role/${this.roleID}`)
          await post(url, this.role)
        } else {
          const url = getURL(`/api/role/new`)
          const id = await post(url, this.role)
          this.$router.push(`/role/show/${id}`)
        }
      } catch (e) {
        //
      }
      this.loading = false
    },
    notEmpty (val) {
      return (
        (typeof val === 'string' && val.length) || this.$t('cannot_be_empty')
      )
    }
  }
}
</script>
