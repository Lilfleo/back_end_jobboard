const router = require('express').Router();
const adComp = require('../control/compController');
const {checkRole} = require('../role/roleMiddleware'); // Importez le middleware



router.get('/',checkRole(['admin', 'user']),adComp.getComp); // Récupérer toutes les entreprises
router.post('/',checkRole(['admin', 'comp']),adComp.createComp); // Crée une entreprise
router.get('/:id',checkRole(['admin', 'user']),adComp.getCompById); // Récupérer une entreprise par ID
router.delete('/:id',checkRole(['admin']), adComp.delComp); // Supprime une entreprise par ID
router.put('/:id',checkRole(['admin', 'user']), adComp.updateComp); // Met à jour une entreprise par ID

module.exports = router;
