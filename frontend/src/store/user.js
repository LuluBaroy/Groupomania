import UserRoutes from '../services/user'
import Vue from 'vue'
import VueCookies from 'vue-cookies'
Vue.use(VueCookies)

export const user = {
  namespaced: true,
  state: {
    allUsers: '',
    currentUser: {
      id: '',
      infos: {}
    },
    loggedIn: null
  },
  actions: {
    registerUser ({ commit }, formData) {
      return UserRoutes.registerUser(formData).then(
        (response) => {
          commit('registerUserSuccess', response)
          return Promise.resolve(response)
        },
        (error) => {
          commit('registerUserFailure')
          return Promise.reject(error)
        }
      )
    },
    logUser ({ commit }, user) {
      return UserRoutes.logUser(user).then(
        (user) => {
          commit('logUserSuccess', user)
          return Promise.resolve(user)
        },
        (error) => {
          commit('logUserFailure', error)
          return Promise.reject(error)
        }
      )
    },
    updateUser ({ commit }, payload) {
      return UserRoutes.updateUser(payload).then(
        (response) => {
          commit('updateUserSuccess', response)
          return Promise.resolve(response)
        },
        (error) => {
          commit('updateUserFailure')
          return Promise.reject(error)
        }
      )
    },
    deleteUser ({ commit }, id) {
      return UserRoutes.deleteUser(id).then(
        (response) => {
          commit('deleteUserSuccess', response)
          return Promise.resolve(response)
        },
        (error) => {
          commit('deleteUserFailure')
          return Promise.reject(error)
        }
      )
    },
    getAllUser ({ commit }) {
      return UserRoutes.getAllUser().then(
        (response) => {
          commit('getAllUserSuccess', response)
          return Promise.resolve(response)
        },
        (error) => {
          commit('getAllUserFailure')
          return Promise.reject(error)
        }
      )
    },
    getOneUser ({ commit }, id) {
      return UserRoutes.getOneUser(id).then(
        (response) => {
          commit('getOneUserSuccess', response)
          return Promise.resolve(response)
        },
        (error) => {
          commit('getOneUserFailure')
          return Promise.reject(error)
        }
      )
    },
    getCurrentUser ({ commit }, userId) {
      return UserRoutes.getCurrentUser(userId).then(
        (user) => {
          commit('getCurrentUserSuccess', user)
          return Promise.resolve(user)
        },
        (error) => {
          commit('getCurrentUserFailure')
          return Promise.reject(error)
        }
      )
    },
    updatePrivilege ({ commit }, id) {
      return UserRoutes.updatePrivilege(id).then(
          (response) => {
            commit('updatePrivilegeSuccess', response)
            return Promise.resolve(response)
          },
          (error) => {
            commit('updatePrivilegeFailure')
            return Promise.reject(error)
          }
      )
    }
  },
  mutations: {
    registerUserSuccess (state, response) {
      state.register = response
    },
    registerUserFailure () {},
    logUserSuccess (state) {
      state.loggedIn = true
      state.currentUser.id = Vue.$cookies.get('user').user_id
    },
    logUserFailure () {},
    updateUserSuccess () {},
    updateUserFailure () {},
    deleteUserSuccess (state) {
      state.loggedIn = false
    },
    deleteUserFailure () {},
    getAllUserSuccess (state, response) {
      state.allUsers = response.data
    },
    getAllUserFailure () {},
    getOneUserSuccess () {},
    getOneUserFailure () {},
    getCurrentUserSuccess (state, user) {
      state.currentUser.id = user.data.id
      state.currentUser.infos = user.data
      state.loggedIn = true
    },
    getCurrentUserFailure () {},
    updatePrivilegeSuccess () {},
    updatePrivilegeFailure () {}
  }
}
