import axios from 'axios'
import Vue from 'vue'
import VueCookies from 'vue-cookies'
import auth from '../services/auth'
Vue.use(VueCookies)
const url = window.location.protocol + '//' + window.location.hostname + ':3000/api/auth/'

class UserRoutes {
  registerUser (formData) {
    return axios.post(url + 'signup', formData)
      .catch((err) => {
        throw err
      })
  }
  logUser (data) {
    return axios.post(url + 'login', data)
      .then(response => {
        Vue.$cookies.get('user')
        if (Vue.$cookies.get('user') === null || Vue.$cookies.get('user').user_id !== response.data.user_id) {
          Vue.$cookies.set('user', response.data, '1d')
        }
      }).catch((err) => {
        throw err
      })
  }
  updateUser (payload) {
    return axios.put(url + payload.userId, payload.formData, { headers: auth() })
      .catch((err) => {
        throw err
      })
  }
  deleteUser (id) {
    return axios.delete(url + id, { headers: auth() })
      .catch((err) => {
        throw err
      })
  }
  getAllUser () {
    return axios.get(url, { headers: auth() })
  }
  getOneUser (id) {
    return axios.get(url + id, { headers: auth() })
      .catch((err) => {
        throw err
      })
  }
  getCurrentUser () {
    let userId = Vue.$cookies.get('user').user_id
    return axios.get(url + userId, { headers: auth() })
      .catch((err) => {
        throw err
      })
  }
  updatePrivilege (id) {
      return axios.put(url + id + '/update_privilege', '', { headers: auth() })
          .catch((err) => {
              throw err
          })
  }
}

export default new UserRoutes()
