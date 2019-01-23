const router = require('express').Router();
const thingsRoutes = require('./things');

router.use('/things', thingsRoutes);

module.exports = router;