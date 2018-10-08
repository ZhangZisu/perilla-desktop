<template>
  <v-container>
    <v-flex>
      <v-card>
        <v-card-title class="headline" v-text="$t('register')"/>
        <v-card-text>
          <v-text-field v-model="username" :label="$t('username')" required/>
          <v-text-field v-model="realname" :label="$t('realname')" required/>
          <v-text-field v-model="email" :label="$t('email')" type="email" required/>
          <v-text-field v-model="password" :label="$t('password')" type="password" required/>
        </v-card-text>
        <v-card-actions>
          <v-spacer/>
          <v-btn color="primary" @click.stop="register" v-text="$t('register')"/>
        </v-card-actions>
      </v-card>
    </v-flex>
  </v-container>
</template>

<script>
import { post } from '../httphelper'

export default {
  name: 'registerView',
  data () {
    return {
      username: '',
      password: '',
      realname: '',
      email: ''
    }
  },
  methods: {
    async register () {
      try {
        const result = await post('/register', {
          username: this.username,
          password: this.password,
          realname: this.realname,
          email: this.email
        })
        this.$router.push(`/signin?welcome=${result}`)
      } catch (e) {
        //
      }
    }
  }
}
</script>
