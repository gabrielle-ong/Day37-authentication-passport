var express           = require('express');
var router            = express.Router();
var passport          = require("passport");
var usersController   = require('../controllers/usersController');
var staticsController = require('../controllers/staticsController');

function authenticatedUser (req, res, next){
    if (req.isAuthenticated()) return next();
    //isAuthenticated is a passport method. if authenticated, proceed
    
    req.flash('errorMessage', "Login to access this page");
    res.redirect('/login');
}

router.route('/secret')
    .get(authenticatedUser, usersController.getSecret)
    // when get /secret, run authenticatedUser first then pass usersController.getSecret as the next() function

router.route('/')
  .get(staticsController.home);

router.route('/signup')
  .get(usersController.getSignup)
  .post(usersController.postSignup)

router.route('/login')
  .get(usersController.getLogin)
  .post(usersController.postLogin)

router.route("/logout")
  .get(usersController.getLogout)

module.exports = router