const router = require('express').Router();
const adApp = require('../control/applyController');
const {checkRole} = require('../role/roleMiddleware'); 


router.get('/',checkRole(['admin']), adApp.getApplication);// Récupérer
router.post('/:id',adApp.createApplication); //creer
router.delete('/:id',checkRole(['admin']),adApp.delApplication); //delete

module.exports = router;