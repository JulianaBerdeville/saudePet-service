const express = require('express');
const petController = require('../controllers/petController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.use((req, res, next) => {
	return authMiddleware(req, res, next);
});

router.post('/', petController.createPet);
router.get('/', petController.getPets);
router.get('/:id', petController.getPetById);
router.put('/:id', petController.updatePet);
router.delete('/:id', petController.deletePet);

module.exports = router;
