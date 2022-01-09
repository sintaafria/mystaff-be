const router = require('express').Router();
const profileController = require('./controller');
const { police_check } = require('../../middlewares');
const multer = require('multer');
const os = require('os');

router.post(
    '/staff-profile', 
    police_check('create', 'staff-profile'), 
    profileController.store
);

router.put(
    '/staff-profile/:id', 
    multer({dest: os.tmpdir()}).single('image'),
    profileController.update
);

router.get(
    '/staff-profile',
    police_check('view', 'staff-profile'),
    profileController.show
);

module.exports = router;
