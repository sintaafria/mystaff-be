const router = require('express').Router();
const { police_check } = require('../../middlewares');
const permitController = require('./controller');
const multer = require('multer');
const os = require('os');

router.post(
    '/permit', 
    police_check('create', 'permit'), 
    multer({dest: os.tmpdir()}).single('file'),
    permitController.store
);
router.put('/permit', permitController.update);
router.get('/permit', police_check('view', 'permit'));

module.exports = router;