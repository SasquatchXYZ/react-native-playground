const router = require('express').Router();
const thingsController = require('../../controllers/thingsController');

router.route('/:id')
  .get(thingsController.findUser);

module.exports = router;