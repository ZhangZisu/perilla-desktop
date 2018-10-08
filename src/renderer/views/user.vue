<template>
  <v-container>
    <v-flex>
      <v-card>
        <v-progress-linear v-if="showProgressBar" indeterminate/>
        <v-card-title class="headline" v-text="$t('users')"/>
        <v-card-text>
          <v-list three-line>
            <v-list-tile v-for="user in users" :key="user._id" :to="`/user/show/${user._id}`">
              <v-list-tile-content>
                <v-list-tile-title v-text="user.username"/>
                <v-list-tile-sub-title v-text="user._id"/>
                <v-list-tile-sub-title v-text="$t('user_info', [user.realname, user.email])"/>
              </v-list-tile-content>
              <v-list-tile-action>
                <v-list-tile-action-text>
                  <role v-for="(role, j) in user.roles" :key="`${i}-${j}`" :id="role"/>
                </v-list-tile-action-text>
              </v-list-tile-action>
            </v-list-tile>
          </v-list>
        </v-card-text>
        <v-card-actions>
          <v-pagination v-model="page" :length="allPages" :total-visible="7"/>
          <v-spacer/>
          <v-dialog width="500">
            <v-btn slot="activator" color="secondary" v-text="$t('filter')"/>
            <v-card>
              <v-card-title class="headline" primary-title v-text="$t('filter')"/>
              <v-card-text>
                <v-text-field v-model="filter.search" :label="$t('search')"/>
                <v-text-field v-model="filter.username" :label="$t('username')"/>
                <v-text-field v-model="filter.realname" :label="$t('realname')"/>
                <v-text-field v-model="filter.email" :label="$t('email')"/>
                <z-auto-complete v-model="filter.roles" text-prop="rolename" :hint="$t('input_rolename')" query-url="/api/role/list" multiple/>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" v-text="$t('apply')" :to="'/user?' + generateQuery(filter)"/>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-btn color="primary" to="/user/new" v-text="$t('new')"/>
        </v-card-actions>
      </v-card>
    </v-flex>
  </v-container>
</template>

<script>
import { getURL, get, getPURL, generateQuery } from '../httphelper'
import role from '../components/role'
import zAutoComplete from '../components/zAutoComplete'
const itemsPerPage = 25

export default {
  name: 'userView',
  components: {
    role,
    zAutoComplete
  },
  props: {
    username: String,
    realname: String,
    email: String,
    roles: String,
    search: String
  },
  data () {
    return {
      page: 1,
      allPages: 1,
      users: [],
      showProgressBar: true,
      filter: {
        username: null,
        realname: null,
        email: null,
        roles: null,
        search: null
      }
    }
  },
  async mounted () {
    const query = {
      username: this.username,
      realname: this.realname,
      email: this.email,
      roles: this.roles,
      search: this.search
    }
    const countURL = getURL('/api/user/count', query)
    const count = await get(countURL)
    this.allPages = Math.floor((count + itemsPerPage - 1) / itemsPerPage)
    const fetchURL = getPURL('/api/user/list', query, itemsPerPage, 1)
    this.users = await get(fetchURL)
    this.showProgressBar = false
  },
  watch: {
    async page (val) {
      this.showProgressBar = true
      const query = {
        username: this.username,
        realname: this.realname,
        email: this.email,
        roles: this.roles,
        search: this.search
      }
      const fetchURL = getPURL('/api/user/list', query, itemsPerPage, val)
      this.users = await get(fetchURL)
      this.showProgressBar = false
    }
  },
  methods: {
    generateQuery: generateQuery
  }
}
</script>
