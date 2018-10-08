<template>
  <v-container>
    <v-flex>
      <v-card>
        <v-progress-linear v-if="loading" indeterminate query/>
        <v-card-title class="headline" v-text="$t('edit_user')"/>
        <v-card-text>
          <div class="subheading" v-text="$t('basic')"/>
          <v-form>
            <v-text-field v-model="user.username" :label="$t('username')" :rules="[notEmpty]" :readonly="!!userID"/>
            <v-text-field v-model="user.realname" :label="$t('realname')" :rules="[notEmpty]"/>
            <v-text-field v-model="user.email" :label="$t('email')" :rules="[notEmpty]"/>
            <v-text-field v-model="user.bio" :label="$t('bio')" :rules="[notEmpty]"/>
            <div class="subheading" v-text="$t('roles')"/>
            <z-array-editor v-model="user.roles" textProp="rolename" :hint="$t('input_rolename')" queryURL="/api/role/list" v-if="!loading">
              <template slot="items" slot-scope="data">
                <role :id="data.value"/>
              </template>
            </z-array-editor>
          </v-form>
          <template v-if="!loading && userID">
            <div class="subheading" v-text="$t('access_config')"/>
            <json-editor v-model="user.config" :valid.sync="valid"/>
          </template>
        </v-card-text>
        <v-card-actions>
          <v-spacer/>
          <v-btn v-text="$t('cancel')" @click="$router.push(-1)"/>
          <v-btn color="primary" v-text="$t('save')" @click="save" :disabled="loading || !valid"/>
        </v-card-actions>
      </v-card>
    </v-flex>
  </v-container>
</template>

<script>
import { getURL, get, post } from '../httphelper'
import jsonEditor from '../components/jsonEditor'
import role from '../components/role'
import zArrayEditor from '../components/zArrayEditor'

export default {
  name: 'userEditView',
  components: {
    jsonEditor,
    role,
    zArrayEditor
  },
  props: {
    userID: String
  },
  data () {
    return {
      user: {
        _id: '',
        username: '',
        realname: '',
        email: '',
        bio: '',
        roles: [],
        config: {}
      },
      loading: true,
      valid: true
    }
  },
  async mounted () {
    if (this.userID) {
      const url = getURL(`/api/user/${this.userID}`)
      this.user = await get(url)
    }
    this.loading = false
  },
  methods: {
    async save () {
      this.loading = true
      try {
        if (this.userID) {
          const url = getURL(`/api/user/${this.userID}`)
          await post(url, this.user)
        } else {
          const url = getURL(`/api/user/new`)
          const id = await post(url, this.user)
          this.$router.push(`/user/show/${id}`)
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
