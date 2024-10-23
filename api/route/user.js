const router = require('express').Router();
const adUser = require('../control/userController');
const {checkRole} = require('../role/roleMiddleware'); 

router.get('/',checkRole(['admin']),adUser.getAllUser); // Récupérer tous les utilisateurs R
router.delete('/:id',checkRole(['admin', 'user']), adUser.delUser); // Supprime un utilisateur, si le rôle le permet
router.put('/:id',checkRole(['admin', 'user']),adUser.updateUser); // Met à jour un utilisateur

module.exports = router;
