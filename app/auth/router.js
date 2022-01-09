const router = require('express').Router();
const authController = require('./controller');
const passport = require('passport');
const LocalStrategy  = require('passport-local').Strategy;

passport.use(new LocalStrategy({usernameField: 'email'}, authController.localStrategy));
router.post('/register-staff', authController.register);
router.post('/register-company', authController.companyRegister);
router.post('/login', authController.login);
router.post('/logout', authController.logout);

module.exports = router;