import PostsRoutes from '../services/posts'

export const posts = {
  namespaced: true,
  state: {
    allPosts: '',
    allComments: '',
    likes: '',
    allPostsFromUser: ''
  },
  actions: {
    getAllPosts ({ commit }) {
      return PostsRoutes.getAllPosts().then(
        (response) => {
          commit('getAllPostsSuccess', response)
          return Promise.resolve(response)
        },
        (error) => {
          commit('getAllPostsFailure')
          return Promise.reject(error)
        }
      )
    },
    getAllPostsFromOneUser ({ commit }, id) {
      return PostsRoutes.getAllPostsFromOneUser(id).then(
        (response) => {
          commit('getAllPostsFromOneUserSuccess', response)
          return Promise.resolve(response)
        },
        (error) => {
          commit('getAllPostsFromOneUserFailure')
          return Promise.reject(error)
        }
      )
    },
    getOnePost ({ commit }, id) {
      return PostsRoutes.getOnePost(id).then(
        (response) => {
          commit('getOnePostSuccess', response)
          return Promise.resolve(response)
        },
        (error) => {
          commit('getOnePostFailure')
          return Promise.reject(error)
        }
      )
    },
    createPost ({ commit }, formData) {
      return PostsRoutes.createPost(formData).then(
        (response) => {
          commit('createPostSuccess', response)
          return Promise.resolve(response)
        },
        (error) => {
          commit('createPostFailure')
          return Promise.reject(error)
        }
      )
    },
    updatePost ({ commit }, payload) {
      return PostsRoutes.updatePost(payload).then(
        (response) => {
          commit('updatePostSuccess', response)
          return Promise.resolve(response)
        },
        (error) => {
          commit('updatePostFailure')
          return Promise.reject(error)
        }
      )
    },
    deletePost ({ commit }, id) {
      return PostsRoutes.deletePost(id).then(
        (response) => {
          commit('deletePostSuccess', response)
          return Promise.resolve(response)
        },
        (error) => {
          commit('deletePostFailure')
          return Promise.reject(error)
        }
      )
    },
    sendPostReport ({ commit }, payload) {
      return PostsRoutes.sendPostReport(payload).then(
        (response) => {
          commit('sendPostReportSuccess', response)
          return Promise.resolve(response)
        },
        (error) => {
          commit('sendPostReportFailure')
          return Promise.reject(error)
        }
      )
    },
    getComments ({ commit }, id) {
      return PostsRoutes.getComments(id).then(
        (response) => {
          commit('getCommentsSuccess', response)
          return Promise.resolve(response)
        },
        (error) => {
          commit('getCommentsFailure')
          return Promise.reject(error)
        }
      )
    },
    getOneComment ({ commit }, payload) {
      return PostsRoutes.getOneComment(payload).then(
        (response) => {
          commit('getOneCommentSuccess', response)
          return Promise.resolve(response)
        },
        (error) => {
          commit('getOneCommentFailure')
          return Promise.reject(error)
        }
      )
    },
    createComment ({ commit }, payload) {
      return PostsRoutes.createComment(payload).then(
        (response) => {
          commit('createCommentSuccess', response)
          return Promise.resolve(response)
        },
        (error) => {
          commit('createCommentFailure')
          return Promise.reject(error)
        }
      )
    },
    updateComment ({ commit }, payload) {
      return PostsRoutes.updateComment(payload).then(
        (response) => {
          commit('updateCommentSuccess', response)
          return Promise.resolve(response)
        },
        (error) => {
          commit('updateCommentFailure')
          return Promise.reject(error)
        }
      )
    },
    deleteComment ({ commit }, payload) {
      return PostsRoutes.deleteComment(payload).then(
        (response) => {
          commit('deleteCommentSuccess', response)
          return Promise.resolve(response)
        },
        (error) => {
          commit('deleteCommentFailure')
          return Promise.reject(error)
        }
      )
    },
    sendCommentReport ({ commit }, payload) {
      return PostsRoutes.sendCommentReport(payload).then(
        (response) => {
          commit('sendCommentReportSuccess', response)
          return Promise.resolve(response)
        },
        (error) => {
          commit('sendCommentReportFailure')
          return Promise.reject(error)
        }
      )
    },
    createLike ({ commit }, id) {
      return PostsRoutes.createLike(id).then(
        (response) => {
          commit('createLikeSuccess', response)
          return Promise.resolve(response)
        },
        (error) => {
          commit('createLikeFailure')
          return Promise.reject(error)
        }
      )
    },
    getLikes ({ commit }, id) {
      return PostsRoutes.getLikes(id).then(
        (response) => {
          commit('getLikesSuccess', response)
          return Promise.resolve(response)
        },
        (error) => {
          commit('getLikesFailure')
          return Promise.reject(error)
        }
      )
    }
  },
  mutations: {
    getAllPostsSuccess (state, response) {
      state.allPosts = response.data
    },
    getAllPostsFailure () {},
    getAllPostsFromOneUserSuccess (state, response) {
      state.allPostsFromUser = response.data
    },
    getAllPostsFromOneUserFailure () {},
    getOnePostSuccess () {},
    getOnePostFailure () {},
    createPostSuccess (state) {
      state.createdPost = 'Posted'
    },
    createPostFailure () {},
    updatePostSuccess (state) {
      state.updatedPost = 'Updated'
    },
    updatePostFailure () {},
    deletePostSuccess (state) {
      state.deletedPost = 'Deleted'
    },
    deletePostFailure () {},
    sendPostReportSuccess () {},
    sendPostReportFailure () {},
    getCommentsSuccess (state, response) {
      state.allComments = response.data
    },
    getCommentsFailure () {},
    getOneCommentFailure () {},
    getOneCommentSuccess () {},
    createCommentSuccess () {},
    createCommentFailure () {},
    updateCommentSuccess () {},
    updateCommentFailure () {},
    deleteCommentSuccess () {},
    deleteCommentFailure () {},
    sendCommentReportSuccess () {},
    sendCommentReportFailure () {},
    createLikeSuccess () {},
    createLikeFailure () {},
    getLikesSuccess (state, response) {
      state.likes = response.data
    },
    getLikesFailure () {}
  }
}
