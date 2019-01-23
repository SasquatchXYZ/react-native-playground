import axios from 'axios';
import {DOMAIN} from 'react-native-dotenv';
import {LOCAL_IP} from 'react-native-dotenv';

export default {
  getUser: function (accessToken) {
    // console.log(accessToken);
    // console.log(LOCAL_IP);
    return axios.get(`http://${LOCAL_IP}:3000/api/things/${accessToken}`)
    // return axios.get(`https://${DOMAIN}/userinfo`, {headers: {Authorization: `Bearer ${accessToken}`}})
  }
}