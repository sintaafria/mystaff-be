const router = require('express').Router();
const userController = require('./controller');
const { police_check } = require('../../middlewares');

router.get('/staff', police_check('view', 'staff'), userController.showStaff);
router.get('/staff/:id', police_check('view', 'staff-detail'), userController.staffDetail);
router.delete('/staff/:id', police_check('delete', 'staff'), userController.destroy);

module.exports = router;