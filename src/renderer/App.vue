<template>
  <v-app>
    <v-navigation-drawer persistent v-model="drawer" enable-resize-watcher fixed app>
      <v-list>
        <v-list-tile to="/">
          <v-list-tile-action>
            <v-icon>home</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title v-text="$t('home')"/>
          </v-list-tile-content>
        </v-list-tile>
        <template v-if="loggedin">
          <v-list-tile to="/file">
            <v-list-tile-action>
              <v-icon>folder</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title v-text="$t('file')"/>
            </v-list-tile-content>
          </v-list-tile>
          <v-list-tile to="/problem">
            <v-list-tile-action>
              <v-icon>notes</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title v-text="$t('problem')"/>
            </v-list-tile-content>
          </v-list-tile>
          <v-list-tile to="/solution">
            <v-list-tile-action>
              <v-icon>assignment_turned_in</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title v-text="$t('solution')"/>
            </v-list-tile-content>
          </v-list-tile>
          <v-list-tile to="/role">
            <v-list-tile-action>
              <v-icon>supervised_user_circle</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title v-text="$t('role')"/>
            </v-list-tile-content>
          </v-list-tile>
          <v-list-tile to="/user">
            <v-list-tile-action>
                <v-icon>account_circle</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title v-text="$t('user')"/>
            </v-list-tile-content>
          </v-list-tile>
          <v-list-tile to="/logout">
            <v-list-tile-action>
                <v-icon>power_settings_new</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title v-text="$t('logout')"/>
            </v-list-tile-content>
          </v-list-tile>
        </template>
        <template v-else>
          <v-list-tile to="/signin">
            <v-list-tile-action>
              <v-icon>account_circle</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title v-text="$t('login')"/>
            </v-list-tile-content>
          </v-list-tile>
        </template>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar app dark color="primary">
      <v-toolbar-side-icon @click.stop="drawer = !drawer"/>
      <v-toolbar-title v-text="title"/>
      <v-spacer/>
			<v-menu offset-y>
				<v-btn slot="activator" icon flat>
					<v-icon>language</v-icon>
				</v-btn>
				<v-list>
					<v-list-tile v-for="(lang, i) in languages" :key="`lang${i}`" ripple @click="setLang(lang.name)">
						<v-list-tile-title v-text="lang.display_name"/>
					</v-list-tile>
				</v-list>
			</v-menu>
      <v-btn icon flat @click="showThemeDialog = !showThemeDialog">
        <v-icon>format_color_fill</v-icon>
      </v-btn>
      <v-menu :close-on-content-click="false" offset-y>
        <v-btn slot="activator" icon flat>
          <v-icon>refresh</v-icon>
        </v-btn>
        <v-card>
          <v-card-text>
            <v-text-field v-model="baseURL" :label="$t('base_url')"/>
          </v-card-text>
        </v-card>
      </v-menu>
    </v-toolbar>
    <v-content>
      <router-view :key="$route.fullPath"/>
    </v-content>
    <v-footer app fixed dark color="primary">
      <span class="pa-2">&copy;ZhangZisu 2018</span>
      <v-spacer/>
      <span class="pa-2">version 0.0.4</span>
    </v-footer>
    <v-snackbar v-model="snackbar" color="error">
      {{ snackbarText }}
    </v-snackbar>
    <v-dialog v-model="showThemeDialog" max-width="1100px">
      <v-card>
        <v-card-title class="headline" v-text="$t('theme')"/>
        <v-card-text>
          <div class="subheading" v-text="$t('primary')"/>
          <swatches v-model="$vuetify.theme.primary" inline colors="material-basic" show-fallback/>
          <div class="subheading" v-text="$t('secondary')"/>
          <swatches v-model="$vuetify.theme.secondary" inline colors="material-basic" show-fallback/>
          <div class="subheading" v-text="$t('accent')"/>
          <swatches v-model="$vuetify.theme.accent" inline colors="material-basic" show-fallback/>
          <div class="subheading" v-text="$t('error')"/>
          <swatches v-model="$vuetify.theme.error" inline colors="material-basic" show-fallback/>
          <div class="subheading" v-text="$t('info')"/>
          <swatches v-model="$vuetify.theme.info" inline colors="material-basic" show-fallback/>
          <div class="subheading" v-text="$t('success')"/>
          <swatches v-model="$vuetify.theme.success" inline colors="material-basic" show-fallback/>
          <div class="subheading" v-text="$t('warning')"/>
          <swatches v-model="$vuetify.theme.warning" inline colors="material-basic" show-fallback/>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script>
import axios from 'axios'
import Swatches from 'vue-swatches'
import 'vue-swatches/dist/vue-swatches.min.css'

export default {
  name: 'App',
  components: {
    Swatches
  },
  data () {
    return {
      drawer: true,
      snackbar: false,
      snackbarText: '',
      showThemeDialog: false,
      languages: [
        {
          name: 'en',
          display_name: 'English'
        },
        {
          name: 'zh-Hans',
          display_name: '简体中文'
        },
        {
          name: 'zh-Hant',
          display_name: '正體中文'
        },
        {
          name: 'ja',
          display_name: '日本語'
        }
      ]
    }
  },
  computed: {
    title: function () {
      return this.$store.state.title
    },
    loggedin: function () {
      return !!this.$store.state.accessToken
    },
    baseURL: {
      set (v) {
        axios.defaults.baseURL = v
        localStorage.setItem('baseURL', v)
      },
      get () {
        return axios.defaults.baseURL
      }
    }
  },
  watch: {
    '$store.state.error': function (val) {
      this.snackbar = true
      this.snackbarText = val
    },
    '$vuetify.theme': {
      handler: function (val) {
        localStorage.setItem('theme', JSON.stringify(val))
      },
      deep: true
    }
  },
  created () {
    // Load base-url
    axios.defaults.baseURL = localStorage.getItem('baseURL') || ''
    // Load language
    let language = localStorage.getItem('language')
    if (language) {
      this.$i18n.locale = language
    } else {
      for (let language of navigator.languages) {
        if (this.languages.filter(x => x.name === language).length) {
          this.$i18n.locale = language
          break
        }
      }
    }
    // Load theme
    if (localStorage.getItem('theme')) {
      this.$vuetify.theme = JSON.parse(localStorage.getItem('theme'))
    } else {
      localStorage.setItem('theme', JSON.stringify(this.$vuetify.theme))
    }
  },
  methods: {
    setLang (language) {
      this.$i18n.locale = language
      localStorage.setItem('language', language)
    }
  }
}
</script>
