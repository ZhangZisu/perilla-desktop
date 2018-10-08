<template>
  <v-container>
    <v-flex>
      <v-card>
        <v-progress-linear v-if="showProgressBar" indeterminate/>
        <v-card-title class="headline" v-text="$t('files')"/>
        <v-card-text>
          <v-list three-line>
            <v-list-tile v-for="file in files" :key="file._id" avatar :to="'/file/show/' + file._id">
              <v-list-tile-avatar>
                <v-icon>folder</v-icon>
              </v-list-tile-avatar>
              <v-list-tile-content>
                <v-list-tile-title v-text="file.filename"/>
                <v-list-tile-sub-title v-text="file._id"/>
                <v-list-tile-sub-title>
                  {{$t('createdat', [(new Date(file.created)).toLocaleString()])}} {{$t('by')}} <user :id="file.owner"/>
                </v-list-tile-sub-title>
              </v-list-tile-content>
            </v-list-tile>
          </v-list>
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
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="primary" v-text="$t('apply')" :to="'/file?' + generateQuery(filter)"/>
                </v-card-actions>
              </v-card>
            </v-dialog>
            <v-menu offset-y>
              <v-btn slot="activator" color="primary" v-text="$t('new')"/>
              <v-list>
                <v-list-tile to="/file/new">
                  <v-list-tile-title v-text="$t('editor')"/>
                </v-list-tile>
                <v-list-tile to="/file/upload">
                  <v-list-tile-title v-text="$t('upload')"/>
                </v-list-tile>
              </v-list>
            </v-menu>
          </v-card-actions>
        </v-card-text>
      </v-card>
    </v-flex>
  </v-container>
</template>

<script>
import { getURL, getPURL, get, generateQuery } from '../httphelper'
import user from '../components/user'
import ace from '../components/ace'
import zAutoComplete from '../components/zAutoComplete'
const itemsPerPage = 5

export default {
  name: 'fileView',
  components: {
    user,
    ace,
    zAutoComplete
  },
  props: {
    owner: String,
    search: String
  },
  data () {
    return {
      page: 1,
      allPages: 1,
      files: [],
      dialog: false,
      showProgressBar: true,
      filter: {
        owner: '',
        search: ''
      }
    }
  },
  async mounted () {
    const query = { owner: this.owner, search: this.search }
    const countURL = getURL('/api/file/count', query)
    const count = await get(countURL)
    const allPages = Math.floor((count + itemsPerPage - 1) / itemsPerPage)
    this.allPages = allPages
    const fetchURL = getPURL('/api/file/list', query, itemsPerPage, 1)
    const files = await get(fetchURL)
    this.files = files
    this.showProgressBar = false
  },
  watch: {
    page: async function (page) {
      const query = { owner: this.owner, search: this.search }
      const fetchURL = getPURL('/api/file/list', query, itemsPerPage, page)
      const files = await get(fetchURL)
      this.files = files
    }
  },
  methods: {
    generateQuery: generateQuery
  }
}
</script>
