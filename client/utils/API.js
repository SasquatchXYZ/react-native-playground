import axios from 'axios';

export default {
  getUser: function (sub) {
    return axios.get(`/api/things/${sub}`)
  }
}