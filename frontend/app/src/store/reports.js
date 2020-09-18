import ReportsRoutes from '../services/reports'

export const reports = {
  state: {
    allReports: ''
  },
  actions: {
    readOnePostReport ({ commit }, id) {
      return ReportsRoutes.readOnePostReport(id).then(
        (response) => {
          commit('readOnePostReportSuccess', response)
          return Promise.resolve(response)
        },
        (error) => {
          commit('readOnePostReportFailure')
          return Promise.reject(error)
        }
      )
    },
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
    readOneCommentReport ({ commit }, id) {
      return ReportsRoutes.readOneCommentReport(id).then(
        (response) => {
          commit('readOneCommentReportSuccess', response)
          return Promise.resolve(response)
        },
        (error) => {
          commit('readOneCommentReportFailure')
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
    },
    readAllPendingReports ({ commit }) {
      return ReportsRoutes.readAllPendingReports().then(
        (response) => {
          commit('readAllPendingReportsSuccess', response)
          return Promise.resolve(response)
        },
        (error) => {
          commit('rreadAllPendingReportsFailure')
          return Promise.reject(error)
        }
      )
    }
  },
  mutations: {
    readOnePostReportSuccess () {},
    readOnePostReportFailure () {},
    updatePostReportSuccess () {},
    updatePostReportFailure () {},
    deleteOnePostReportSuccess () {},
    deleteOnePostReportFailure () {},
    readOneCommentReportSuccess () {},
    readOneCommentReportFailure () {},
    updateCommentReportSuccess () {},
    updateCommentReportFailure () {},
    deleteOneCommentReportSuccess () {},
    deleteOneCommentReportFailure () {},
    readAllReportsSuccess () {},
    readAllReportsFailure () {},
    readAllPendingReportsSuccess () {},
    readAllPendingReportsFailure () {}
  }
}
