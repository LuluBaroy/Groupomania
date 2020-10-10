import axios from 'axios'
import auth from './auth'
const url = window.location.protocol + '//' + window.location.hostname + ':3000/api/posts/'

class PostsRoutes {
  getAllPosts () {
    return axios.get(url, { headers: auth() })
      .catch(error => {
        throw error
      })
  }
  getAllPostsFromOneUser (id) {
    return axios.get(url + 'from/' + id, { headers: auth() })
      .catch(error => {
        throw error
      })
  }
  getOnePost (id) {
    return axios.get(url + id, { headers: auth() })
      .catch(error => {
        throw error
      })
  }
  createPost (formData) {
    return axios.post(url, formData, { headers: auth() })
      .catch(error => {
        throw error
      })
  }
  updatePost (payload) {
    return axios.put(url + payload.id, payload.data, { headers: auth() })
      .catch(error => {
        throw error
      })
  }
  deletePost (id) {
    return axios.delete(url + id, { headers: auth() })
      .catch(error => {
        throw error
      })
  }
  sendPostReport (payload) {
    return axios.post(url + payload.id + '/report', payload.newReport, { headers: auth() })
      .catch(error => {
        throw error
      })
  }
  getComments (id) {
    return axios.get(url + id + '/all/comments', { headers: auth() })
      .catch(error => {
        throw error
      })
  }
  getOneComment (payload) {
    return axios.get(url + payload.id + '/' + payload.commentId, { headers: auth() })
      .catch(error => {
        throw error
      })
  }
  createComment (payload) {
    return axios.post(url + payload.id + '/comments', payload.newComment, { headers: auth() })
      .catch(error => {
        throw error
      })
  }
  updateComment (payload) {
    return axios.put(url + payload.id + '/' + payload.commentId, payload.newComment, { headers: auth() })
      .catch(error => {
        throw error
      })
  }
  deleteComment (payload) {
    return axios.delete(url + payload.id + '/' + payload.commentId, { headers: auth() })
      .catch(error => {
        throw error
      })
  }
  sendCommentReport (payload) {
    return axios.post(url + payload.id + '/' + payload.commentId + '/report', payload.newReport, { headers: auth() })
      .catch(error => {
        throw error
      })
  }
  createLike (id) {
    return axios.post(url + id + '/like', '', { headers: auth() })
      .catch(error => {
        throw error
      })
  }
  getLikes (id) {
    return axios.get(url + id + '/like', { headers: auth() })
      .catch(error => {
        throw error
      })
  }
}
export default new PostsRoutes()
