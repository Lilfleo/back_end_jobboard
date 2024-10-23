const router = require('express').Router();
const adAuth = require('../control/authUserController');

router.post("/login", adAuth.login);
router.post("/register", adAuth.register);
router.post('/logout', adAuth.logout); 

module.exports = router;
