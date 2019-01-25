import axios from 'axios';
import {DOMAIN} from 'react-native-dotenv';
import {LOCAL_IP} from 'react-native-dotenv';
import {Platform} from 'react-native';

console.log(Platform.OS);
const DEV_SERVER_URL = Platform.OS === 'android'
  ? LOCAL_IP
  : 'localhost';

console.log(DEV_SERVER_URL);


export default {
  getUser: function (accessToken) {
    // console.log(accessToken);
    // console.log(LOCAL_IP);
    return axios.get(`http://${DEV_SERVER_URL}:3000/api/things/${accessToken}`)
    // return axios.get(`https://${DOMAIN}/userinfo`, {headers: {Authorization: `Bearer ${accessToken}`}})
  }
}