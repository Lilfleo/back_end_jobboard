const router = require('express').Router();
const adController = require('../control/adController');
const { checkRole } = require('../role/roleMiddleware');

// Récupérer une annonce par ID avec type (accessible à tous les rôles)
router.get('/:id', adController.getAdvertisementById); 

// Récupérer toutes les annonces avec type (accessible à tous les rôles)
router.get('/', adController.getAdvertisements); 

// Créer une annonce (accessible uniquement aux rôles 'admin' et 'user')
router.post('/', checkRole(['user', 'admin']), adController.createAdvertisement);

// Supprimer une annonce par ID (accessible uniquement aux rôles 'admin')
router.delete('/:id', checkRole(['admin']), adController.delAdvertisement); 

// Mettre à jour une annonce (accessible uniquement aux rôles 'admin')
router.put('/:id', checkRole(['admin']), adController.updateShortAd);

module.exports = router;
