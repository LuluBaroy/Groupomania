import axios from 'axios'
import auth from '../services/auth'

const url = window.location.protocol + '//' + window.location.hostname + ':3000/api/issue'

class UserIssues {
  createIssue (data) {
    return axios.post(url, data)
      .catch(err => { throw err })
  }
  readAllIssues () {
    return axios.get(url, { headers: auth() })
      .catch(err => { throw err })
  }
  readAllPending () {
    return axios.get(url + '/all/pending', { headers: auth() })
      .catch(err => { throw err })
  }
  updateIssue (id) {
    return axios.put(url + '/' + id, '', { headers: auth() })
      .catch(err => { throw err })
  }
  deleteIssue (id) {
    return axios.delete(url + '/' + id, { headers: auth() })
      .catch(err => { throw err })
  }
  messageWaiting () {
    return axios.get(url + '/all/messageWaiting', { headers: auth() })
      .catch(err => { throw err })
  }
}

export default new UserIssues()
