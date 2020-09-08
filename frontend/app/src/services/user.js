import axios from 'axios'
import Vue from 'vue'
import VueCookies from 'vue-cookies'
Vue.use(VueCookies)
const url = 'http://localhost:3000/api/auth/'
function auth () {
  let user = Vue.$cookies.get('user')
  if (user && user.token) {
    return {'Authorization': 'Bearer ' + user.token}
  } else {
    return undefined
  }
}

class UserRoutes {
  registerUser (formData) {
    return axios.post(url + 'signup', formData)
  }
  logUser (data) {
    return axios.post(url + 'login', data)
      .then(response => {
        Vue.$cookies.get('user')
        if (Vue.$cookies.get('user') === null || Vue.$cookies.get('user').user_id !== response.data.user_id) {
          Vue.$cookies.set('user', response.data)
        }
      })
  }
  updateUser (payload) {
    return axios.put(url + payload.userId, payload.formData, { headers: auth() })
  }
  deleteUser (id) {
    return axios.delete(url + id, { headers: auth() })
  }
  getAllUser () {
    return axios.get(url, { headers: auth() })
  }
  getOneUser (id) {
    return axios.get(url + id, { headers: auth() })
  }
  getCurrentUser (userId) {
    return axios.get(url + userId, { headers: auth() })
  }
}

export default new UserRoutes()
