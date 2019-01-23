const axios = require('axios');
const DOMAIN = process.env.DOMAIN;

console.log(DOMAIN);

module.exports = {
  findUser: (req, res) => {
    console.log(req.params.id);
    axios.get(`https://${DOMAIN}/userinfo`, {headers: {Authorization: `Bearer ${req.params.id}`}})
      .then(user => {
        console.log(user);
        res.json(user);
      })
      .catch(err => console.log(err));
  }
};