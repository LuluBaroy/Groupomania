import axios from 'axios'
import auth from '../services/auth'

const url1 = 'http://localhost:3000/api/report'
const url2 = 'http://localhost:3000/api/report/comment/'

class Reports {
  readOnePostReport (id) {
    return axios.get(url1 + '/post/' + id, { headers: auth() })
      .catch(err => { throw err })
  }
  updatePostReport (id) {
    return axios.put(url1 + '/post/' + id, '', { headers: auth() })
      .catch(err => { throw err })
  }
  readAllPendingReports () {
    return axios.get(url1 + '/pending', { headers: auth() })
      .catch(err => { throw err })
  }
  readAllReports () {
    return axios.get(url1, { headers: auth() })
      .catch(err => { throw err })
  }
  deleteOnePostReport (id) {
    return axios.delete(url1 + '/post/' + id, { headers: auth() })
      .catch(err => { throw err })
  }
  readOneCommentReport (id) {
    return axios.get(url2 + id, { headers: auth() })
      .catch(err => { throw err })
  }
  updateCommentReport (id) {
    return axios.put(url2 + id, '', { headers: auth() })
      .catch(err => { throw err })
  }
  deleteOneCommentReport (id) {
    return axios.delete(url2 + id, { headers: auth() })
      .catch(err => { throw err })
  }
}

export default new Reports()
