<template>
  <v-container>
    <v-flex>
      <v-card>
        <v-progress-linear v-if="loading" indeterminate query/>
        <v-card-title>
          <div>
            <div class="headline" v-text="user.username"/>
            <div class="subheading" v-text="user.bio"/>
          </div>
        </v-card-title>
        <v-card-text>
          <v-list>
            <v-list-tile>
              <v-list-tile-content v-text="$t('username')"/>
              <v-list-tile-content class="align-end" v-text="user.username"/>
            </v-list-tile>
            <v-list-tile>
              <v-list-tile-content v-text="$t('realname')"/>
              <v-list-tile-content class="align-end" v-text="user.realname"/>
            </v-list-tile>
            <v-list-tile>
              <v-list-tile-content v-text="$t('email')"/>
              <v-list-tile-content class="align-end" v-text="user.email"/>
            </v-list-tile>
            <v-list-tile>
              <v-list-tile-content v-text="$t('userID')"/>
              <v-list-tile-content class="align-end" v-text="user._id"/>
            </v-list-tile>
            <div class="subheading" v-text="$t('roles')"/>
            <v-divider/>
            <role v-for="(role, i) in user.roles" :key="i" :id="role"/>
            <div class="subheading" v-text="$t('access_control')"/>
            <v-divider/>
            <json-editor v-model="user.config" v-if="!loading" :readonly="true"/>
          </v-list>
        </v-card-text>
        <v-card-actions>
          <v-spacer/>
          <v-btn color="accent" v-text="$t('delete')" @click="deleteUser"/>
          <v-btn color="primary" v-text="$t('edit')" :to="'/user/edit/' + userID"/>
        </v-card-actions>
      </v-card>
    </v-flex>
  </v-container>
</template>

<script>
import { getURL, get, del } from '../httphelper'
import role from '../components/role'
import jsonEditor from '../components/jsonEditor'

export default {
  name: 'userDetailsView',
  components: {
    role,
    jsonEditor
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
      loading: true
    }
  },
  async mounted () {
    const url = getURL(`/api/user/${this.userID}`)
    this.user = await get(url)
    this.loading = false
  },
  methods: {
    async deleteUser () {
      if (confirm(this.$t('delete_user_confirm', [this.user.username]))) {
        const url = getURL(`/api/user/${this.userID}/`)
        try {
          await del(url)
          this.$router.push('/user')
        } catch (e) {
          //
        }
      }
    }
  }
}
</script>
