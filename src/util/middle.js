const passport = require('passport');
const GoogleStrategy = require( 'passport-google-oauth2' ).Strategy;
module.exports = {
    register: function(req,res,next){
        passport.use(new GoogleStrategy({
            clientID: "1067898336377-qb79vp2eoeg8i6ihsgcta36q6gt8ifa2.apps.googleusercontent.com",
            clientSecret: "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",
            callbackURL: "http://localhost:8080/registerGoogle/callback",
            // callbackURL: "https://pqshop.herokuapp.com/registerGoogle/callback",
            passReqToCallback   : true
            },
            function(request, accessToken, refreshToken, profile, done) {
                return done(null, profile);
            }
            ));
            next()
    },
    login: function(req,res,next){
        passport.use(new GoogleStrategy({
            clientID: "1067898336377-qb79vp2eoeg8i6ihsgcta36q6gt8ifa2.apps.googleusercontent.com",
            clientSecret: "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",
            callbackURL: "http://localhost:8080/loginGoogle/callback",
            // callbackURL: "https://pqshop.herokuapp.com/loginGoogle/callback",
            passReqToCallback   : true
            },
            function(request, accessToken, refreshToken, profile, done) {
                return done(null, profile);
            }
            ));
            next()
    }
}