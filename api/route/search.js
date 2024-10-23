const router = require('express').Router();
const { searchJobs } = require('../control/searchController');

router.get('/search', searchJobs);

module.exports = router;
