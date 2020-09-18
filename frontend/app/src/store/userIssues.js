import UserIssues from '../services/userIssues'

export const issues = {
  state: {
    allIssues: '',
    allPendingIssues: '',
    oneIssue: ''
  },
  actions: {
    createIssue ({ commit }, data) {
      return UserIssues.createIssue(data).then(
        (response) => {
          commit('createIssueSuccess', response)
          return Promise.resolve(response)
        },
        (error) => {
          commit('createIssueFailure')
          return Promise.reject(error)
        }
      )
    },
    readOneIssue ({ commit }, id) {
      return UserIssues.readOneIssue(id).then(
        (response) => {
          commit('readOneIssueSuccess', response)
          return Promise.resolve(response)
        },
        (error) => {
          commit('readOneIssueFailure')
          return Promise.reject(error)
        }
      )
    },
    readAllIssues ({ commit }) {
      return UserIssues.readAllIssues().then(
        (response) => {
          commit('readAllIssuesSuccess', response)
          return Promise.resolve(response)
        },
        (error) => {
          commit('readAllIssuesFailure')
          return Promise.reject(error)
        }
      )
    },
    readAllPending ({ commit }) {
      return UserIssues.readAllPending().then(
        (response) => {
          commit('readAllPendingSuccess', response)
          return Promise.resolve(response)
        },
        (error) => {
          commit('rreadAllPendingFailure')
          return Promise.reject(error)
        }
      )
    },
    updateIssue ({ commit }, id) {
      return UserIssues.updateIssue(id).then(
        (response) => {
          commit('updateIssueSuccess', response)
          return Promise.resolve(response)
        },
        (error) => {
          commit('updateIssueFailure')
          return Promise.reject(error)
        }
      )
    }
  },
  mutations: {
    createIssueSuccess () {},
    createIssueFailure () {},
    readOneIssueSuccess (state, response) {
      state.oneIssue = response.data
    },
    readOneIssueFailure () {},
    readAllIssuesSuccess (state, response) {
      state.allIssues = response.data
    },
    readAllIssuesFailure () {},
    readAllPendingSuccess (state, response) {
      state.allPendingIssues = response.data
    },
    readAllPendingFailure () {},
    updateIssueSuccess () {},
    updateIssueFailure () {}
  }
}
