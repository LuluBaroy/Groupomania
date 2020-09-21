import Vue from 'vue'
import VueCookies from 'vue-cookies'
Vue.use(VueCookies)

export default function auth () {
  let user = Vue.$cookies.get('user')
  if (user && user.token) {
    return {'Authorization': 'Bearer ' + user.token}
  } else {
    return undefined
  }
}
