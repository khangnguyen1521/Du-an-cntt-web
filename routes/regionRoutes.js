const express = require('express');
const router = express.Router();
const regionController = require('../controllers/regionController');

// Route tìm kiếm - phải đặt trước route /:id để tránh conflict
router.get('/search', regionController.searchRegions);

router.post('/', regionController.createRegion);
router.get('/', regionController.getRegions);
router.get('/:id', regionController.getRegionById);
router.put('/:id', regionController.updateRegion);
router.delete('/:id', regionController.deleteRegion);

module.exports = router;