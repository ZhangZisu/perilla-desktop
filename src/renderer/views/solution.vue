<template>
  <v-container>
    <v-flex>
      <v-card>
        <v-progress-linear v-if="showProgressBar" indeterminate/>
        <v-card-text class="headline" v-text="$t('solutions')"/>
        <v-card-text>
          <v-list three-line>
            <v-list-tile v-for="solution in solutions" :key="solution._id" :to="'/solution/show/' + solution._id">
            <v-list-tile-content>
              <v-list-tile-title v-text="solution._id"/>
              <v-list-tile-sub-title>
                {{$t('status')}}: {{solution.status}}
              </v-list-tile-sub-title>
              <v-list-tile-sub-title>
                {{$t('createdat', [(new Date(solution.created)).toLocaleString()])}} {{$t('by')}} <user :id="solution.owner"/>
              </v-list-tile-sub-title>
            </v-list-tile-content>
            <v-list-tile-action>
              <v-list-tile-action-text>
                <problem :id="solution.problemID"/>
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
                <z-auto-complete v-model="filter.owner" text-prop="username" :hint="$t('input_username')" query-url="/api/user/list"/>
                <z-auto-complete v-model="filter.problemID" text-prop="title" :hint="$t('input_problem_title')" query-url="/api/problem/list"/>
                <v-text-field v-model="filter.status" :label="$t('status')"/>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" v-text="$t('apply')" :to="'/solution?' + generateQuery(filter)"/>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-card-actions>
      </v-card>
    </v-flex>
  </v-container>
</template>

<script>
import user from '../components/user'
import problem from '../components/problem'
import zAutoComplete from '../components/zAutoComplete'
import { getURL, get, getPURL, generateQuery } from '../httphelper'
const itemsPerPage = 5

export default {
  name: 'solutionView',
  components: {
    user,
    problem,
    zAutoComplete
  },
  props: {
    owner: String,
    problemID: String,
    status: String
  },
  data () {
    return {
      page: 1,
      allPages: 1,
      solutions: [],
      showProgressBar: true,
      filter: {
        owner: null,
        problemID: null,
        status: null
      }
    }
  },
  async created () {
    const query = {
      owner: this.owner,
      problemID: this.problemID,
      status: this.status
    }
    const countURL = getURL('/api/solution/count', query)
    const count = await get(countURL)
    this.allPages = Math.floor((count + itemsPerPage - 1) / itemsPerPage)
    const fetchURL = getPURL('/api/solution/list', query, itemsPerPage, 1)
    this.solutions = await get(fetchURL)
    this.showProgressBar = false
  },
  watch: {
    page: async function (page) {
      const query = {
        owner: this.owner,
        problemID: this.problemID,
        status: this.status
      }
      const fetchURL = getPURL('/api/solution/list', query, itemsPerPage, page)
      this.solutions = await get(fetchURL)
    }
  },
  methods: {
    generateQuery: generateQuery
  }
}
</script>
