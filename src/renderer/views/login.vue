<template>
  <v-container>
    <v-flex>
      <v-card>
        <v-card-title>
          <div class="headline" v-text="$t('login')"/>
        </v-card-title>
        <v-card-text>
          <v-text-field v-model="username" :label="$t('username')"/>
          <v-text-field v-model="password" :label="$t('password')" type="password"/>
        </v-card-text>
        <v-card-actions>
          <v-spacer/>
          <v-btn color="primary" @click="submit" v-text="$t('submit')"/>
          <v-btn to="/signup" v-text="$t('register')"/>
        </v-card-actions>
      </v-card>
    </v-flex>
  </v-container>
</template>

<script>
import { post } from '../httphelper'

export default {
  name: 'loginView',
  data () {
    return {
      username: '',
      password: ''
    }
  },
  methods: {
    async submit () {
      const username = this.username
      const clientID = this.$store.state.clientID
      const password = this.password
      const result = await post('/login', {
        username,
        clientID,
        password
      })
      this.$store.commit('setAccessToken', result)
      this.$router.push('/')
    }
  }
}
</script>
