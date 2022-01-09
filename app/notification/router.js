const { police_check } = require('../../middlewares');
const router = require('express').Router();
const notifController = require('./controller');

router.get('/notif', police_check('view', 'notifications'), notifController.index);
router.get('/notif/:id', police_check('read', 'notification'), notifController.detail);

module.exports = router;