import axios from 'axios'
import auth from './auth'
const url = 'http://localhost:3000/api/posts/'

class PostsRoutes {
  getAllPosts () {
    return axios.get(url, { headers: auth() })
  }
  getAllPostsFromOneUser (id) {
    return axios.get(url + 'from/' + id, { headers: auth() })
  }
  getOnePost (id) {
    return axios.get(url + id, { headers: auth() })
  }
  createPost (formData) {
    return axios.post(url, formData, { headers: auth() })
  }
  updatePost (payload) {
    return axios.put(url + payload.id, payload.data, { headers: auth() })
  }
  deletePost (id) {
    return axios.delete(url + id, { headers: auth() })
  }
  sendPostReport (payload) {
    return axios.post(url + payload.id + '/report', payload.newReport, { headers: auth() })
  }
  getComments (id) {
    return axios.get(url + id + '/all/comments', { headers: auth() })
  }
  getOneComment (payload) {
    return axios.get(url + payload.id + '/' + payload.commentId, { headers: auth() })
  }
  createComment (payload) {
    return axios.post(url + payload.id + '/comments', payload.newComment, { headers: auth() })
  }
  updateComment (payload) {
    return axios.put(url + payload.id + '/' + payload.commentId, payload.newComment, { headers: auth() })
  }
  deleteComment (payload) {
    return axios.delete(url + payload.id + '/' + payload.commentId, { headers: auth() })
  }
  sendCommentReport (payload) {
    return axios.post(url + payload.id + '/' + payload.commentId + '/report', payload.newReport, { headers: auth() })
  }
  createLike (id) {
    return axios.post(url + id + '/like', '', { headers: auth() })
  }
  getLikes (id) {
    return axios.get(url + id + '/like', { headers: auth() })
  }
}
export default new PostsRoutes()
