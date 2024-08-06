const express = require( 'express');
const router = express.Router();
const diningController = require('../controllers/diningController');
const{ verifyToken,verifyAdminKey} = require('../middleware/authMiddleware');

router.post('/create', verifyToken, verifyAdminKey, diningController.createDiningPlace);
router.get('/', diningController.searchDiningPlaces);
router.get('/availability', diningController.getAvailability);

module.exports =router;