import ResearchRoutes from '../services/research'

export const research = {
  resultResearch: '',
  actions: {
    researchUser ({ commit }, data) {
      return ResearchRoutes.researchUser(data).then(
        (response) => {
          commit('researchUserSuccess', response)
          return Promise.resolve(response)
        },
        (error) => {
          commit('researchUserFailure')
          return Promise.reject(error)
        }
      )
    }
  },
  mutations: {
    researchUserSuccess (state, response) {
      state.resultResearch = response.data
    },
    researchUserFailure () {}
  }
}
