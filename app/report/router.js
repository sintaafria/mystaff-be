const router = require('express').Router();
const { police_check } = require('../../middlewares');
const reportController = require('./controller');

router.get('/report', police_check(), reportController.index);
router.post('/report', police_check('create', 'report'), reportController.store);
router.put('/report/:id', reportController.update);
router.delete('/report/:id', reportController.destroy);

module.exports = router;