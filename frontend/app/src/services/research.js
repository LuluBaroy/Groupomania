import axios from 'axios'
import auth from './auth'
const url = 'http://localhost:3000/api/research'
const header = { headers: auth() }

class ResearchRoute {
  researchUser (data) {
    return axios.post(url, data, header)
  }
}
export default new ResearchRoute()
