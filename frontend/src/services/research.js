import axios from 'axios'
import auth from './auth'
const url = window.location.protocol + '//' + window.location.hostname + ':3000/api/research'

class ResearchRoute {
  researchUser (data) {
    return axios.post(url, data, { headers: auth() })
      .catch(error => {
        throw error
      })
  }
}
export default new ResearchRoute()
