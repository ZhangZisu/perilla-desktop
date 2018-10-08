<template>
  <v-container>
    <v-flex>
      <v-card>
        <v-progress-linear v-if="showProgressBar" indeterminate/>
        <v-card-text class="headline" v-text="$t('problems')"/>
        <v-card-text>
          <v-list three-line>
            <v-list-tile v-for="problem in problems" :key="problem._id" :to="'/problem/show/' + problem._id">
              <v-list-tile-content>
                <v-list-tile-title v-text="problem.title"/>
                <v-list-tile-sub-title v-text="problem._id"/>
                <v-list-tile-sub-title>
                  {{$t('createdat', [(new Date(problem.created)).toLocaleString()])}} {{$t('by')}} <user :id="problem.owner"/>
                </v-list-tile-sub-title>
              </v-list-tile-content>
              <v-list-tile-action>
                <v-list-tile-action-text>
                  {{ problem.tags.join(',') }}
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
                <z-auto-complete v-model="filter.owner" text-prop="username" :hint="$t('input_username')" query-url="/api/user/list"/>
                <v-combobox v-model="filter.tags" :label="$t('tags')" hide-selected multiple chips clearable/>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" v-text="$t('apply')" :to="'/problem?' + generateQuery(filter)"/>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-btn color="primary" v-text="$t('new')" to="/problem/new"/>
        </v-card-actions>
      </v-card>
    </v-flex>
  </v-container>
</template>

<script>
import user from '../components/user'
import { getURL, get, getPURL, generateQuery } from '../httphelper'
import zAutoComplete from '../components/zAutoComplete'
const itemsPerPage = 25

export default {
  name: 'problemView',
  components: {
    user,
    zAutoComplete
  },
  props: {
    owner: String,
    search: String,
    tags: String || Array
  },
  data () {
    return {
      page: 1,
      allPages: 1,
      problems: [],
      showProgressBar: true,
      filter: {
        owner: null,
        search: null,
        tags: []
      }
    }
  },
  async created () {
    const query = { owner: this.owner, search: this.search, tags: this.tags }
    const countURL = getURL('/api/problem/count', query)
    const count = await get(countURL)
    const allPages = Math.floor((count + itemsPerPage - 1) / itemsPerPage)
    this.allPages = allPages
    const fetchURL = getPURL('/api/problem/list', query, itemsPerPage, 1)
    const problems = await get(fetchURL)
    this.problems = problems
    this.showProgressBar = false
  },
  methods: {
    generateQuery: generateQuery
  },
  watch: {
    page: async function (page) {
      const query = { owner: this.owner, search: this.search, tags: this.tags }
      const fetchURL = getPURL('/api/problem/list', query, itemsPerPage, page)
      const problems = await get(fetchURL)
      this.problems = problems
    }
  }
}
</script>
