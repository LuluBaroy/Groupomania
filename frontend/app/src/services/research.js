import axios from 'axios'
import auth from './auth'
const url = 'http://localhost:3000/api/research'

class ResearchRoute {
  researchUser (data) {
    return axios.post(url, data, { headers: auth() })
  }
}
export default new ResearchRoute()
