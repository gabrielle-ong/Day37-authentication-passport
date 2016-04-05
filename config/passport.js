var LocalStrategy   = require('passport-local').Strategy;
var User            = require('../models/user');

module.exports = function(passport){
    
    //use passport to store the sessions
    passport.serializeUser(function(user,done){
        done(null, user.id);    
        //given the user, i'll give you the user.id to store the user
    });
    passport.deserializeUser(function(id, done){
        User.findById(id, function(err, user){
            done(err, user);    
            // given the id, give me the user
        })
    });
    
    passport.use('local-signup', new LocalStrategy({
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true
    }, function(req, email, password, done) {
        console.log("user find");
        User.findOne({ 'local.email' : email }, function (err, user) {
            if (err) { 
                return done(err); 
            }
            
            if (user) { 
                return done(null, false, req.flash('errorMessage', "This email is already used!")); 
            }
            
            var newUser = new User();
            newUser.local.email = email;
            newUser.local.password = User.encrypt(password);
            
            newUser.save(function(err, user){
                if (err) {
                    return done(err);
                }
                return done(null, user);
            });
       
        });
    }))
    
    passport.use('local-login', new LocalStrategy({
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true
    }, function(req, email, password, done) {
        User.findOne({ 'local.email' : email }, function (err, user) {
            if (err) { 
                return done(err); 
            }
            
            if (!user) { 
                return done(null, false, req.flash('errorMessage', "No user found!")); 
            }
            
            if (!user.validPassword(password)) { 
                return done(null, false, req.flash('errorMessage', "Incorrect Password")); 
            }   
            
            done(null, user);
        
       
        });
    }))
    
}