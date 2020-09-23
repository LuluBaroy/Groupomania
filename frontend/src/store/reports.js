import ReportsRoutes from '../services/reports'

export const reports = {
  state: {
    allReports: '',
    messageWaiting: {
      issues: '',
      reports: {
        postReports: '',
        commentReports: ''
      },
      total: 0
    }
  },
  actions: {
    updatePostReport ({ commit }, id) {
      return ReportsRoutes.updatePostReport(id).then(
        (response) => {
          commit('updatePostReportSuccess', response)
          return Promise.resolve(response)
        },
        (error) => {
          commit('updatePostReportFailure')
          return Promise.reject(error)
        }
      )
    },
    deleteOnePostReport ({ commit }, id) {
      return ReportsRoutes.deleteOnePostReport(id).then(
        (response) => {
          commit('deleteOnePostReportSuccess', response)
          return Promise.resolve(response)
        },
        (error) => {
          commit('deleteOnePostReportFailure')
          return Promise.reject(error)
        }
      )
    },
    updateCommentReport ({ commit }, id) {
      return ReportsRoutes.updateCommentReport(id).then(
        (response) => {
          commit('updateCommentReportSuccess', response)
          return Promise.resolve(response)
        },
        (error) => {
          commit('updateCommentReportFailure')
          return Promise.reject(error)
        }
      )
    },
    deleteOneCommentReport ({ commit }, id) {
      return ReportsRoutes.deleteOneCommentReport(id).then(
        (response) => {
          commit('deleteOneCommentReportSuccess', response)
          return Promise.resolve(response)
        },
        (error) => {
          commit('deleteOneCommentReportFailure')
          return Promise.reject(error)
        }
      )
    },
    readAllReports ({ commit }) {
      return ReportsRoutes.readAllReports().then(
        (response) => {
          commit('readAllReportsSuccess', response)
          return Promise.resolve(response)
        },
        (error) => {
          commit('readAllReportsFailure')
          return Promise.reject(error)
        }
      )
    }
  },
  mutations: {
    updatePostReportSuccess () {},
    updatePostReportFailure () {},
    deleteOnePostReportSuccess () {},
    deleteOnePostReportFailure () {},
    updateCommentReportSuccess () {},
    updateCommentReportFailure () {},
    deleteOneCommentReportSuccess () {},
    deleteOneCommentReportFailure () {},
    readAllReportsSuccess () {},
    readAllReportsFailure () {}
  }
}
