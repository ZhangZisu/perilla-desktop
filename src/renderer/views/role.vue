<template>
  <v-container>
    <v-flex>
      <v-card>
        <v-progress-linear v-if="showProgressBar" indeterminate/>
        <v-card-title class="headline" v-text="$t('roles')"/>
        <v-card-text>
          <v-list three-line>
            <v-list-tile v-for="role in roles" :key="role._id" :to="'/role/show/' + role._id">
              <v-list-tile-content>
                <v-list-tile-title v-text="role.rolename"/>
                <v-list-tile-sub-title v-text="role._id"/>
                <v-list-tile-sub-title v-text="role.description"/>
              </v-list-tile-content>
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
                <v-text-field v-model="filter.rolename" :label="$t('rolename')"/>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" v-text="$t('apply')" :to="'/role?' + generateQuery(filter)"/>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-btn color="primary" depressed v-text="$t('new')" to="/role/new"/>
        </v-card-actions>
      </v-card>
    </v-flex>
  </v-container>
</template>

<script>
import { getURL, get, getPURL, generateQuery } from '../httphelper'
const itemsPerPage = 25

export default {
  name: 'roleView',
  props: {
    rolename: String,
    search: String
  },
  data () {
    return {
      page: 1,
      allPages: 1,
      roles: [],
      showProgressBar: true,
      filter: {
        rolename: null,
        search: null
      }
    }
  },
  async mounted () {
    const query = { rolename: this.rolename, search: this.search }
    const countURL = getURL('/api/role/count', query)
    const count = await get(countURL)
    this.allPages = Math.floor((count + itemsPerPage - 1) / itemsPerPage)
    const fetchURL = getPURL('/api/role/list', query, itemsPerPage, 1)
    this.roles = await get(fetchURL)
    this.showProgressBar = false
  },
  watch: {
    async page (val) {
      this.showProgressBar = true
      const query = { rolename: this.rolename, search: this.search }
      const fetchURL = getPURL('/api/role/list', query, itemsPerPage, val)
      this.roles = await get(fetchURL)
      this.showProgressBar = false
    }
  },
  methods: {
    generateQuery: generateQuery
  }
}
</script>
