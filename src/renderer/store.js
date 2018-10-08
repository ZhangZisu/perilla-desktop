import Vue from 'vue'
import Vuex from 'vuex'
import { generate } from 'randomstring'

Vue.use(Vuex)

let clientID = localStorage.getItem('clientID')
let accessToken = localStorage.getItem('accessToken')
if (!clientID) {
  clientID = generate({ length: 50 })
  localStorage.setItem('clientID', clientID)
}

export default new Vuex.Store({
  state: {
    clientID,
    accessToken,
    title: '',
    error: ''
  },
  mutations: {
    resetAccessToken (store) {
      store.accessToken = ''
      localStorage.removeItem('accessToken')
    },
    setAccessToken (store, at) {
      store.accessToken = at
      localStorage.setItem('accessToken', at)
    },
    updateError (store, error) {
      store.error = error
    },
    updateTitle (store, title) {
      store.title = title
      document.title = title
    }
  },
  actions: {}
})
