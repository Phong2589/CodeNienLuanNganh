const passport = require('passport');
const GoogleStrategy = require( 'passport-google-oauth2' ).Strategy;
const FacebookStrategy = require( 'passport-facebook' ).Strategy;
module.exports = {
    registerGG: function(req,res,next){
        passport.use(new GoogleStrategy({
            clientID: "1067898336377-qb79vp2eoeg8i6ihsgcta36q6gt8ifa2.apps.googleusercontent.com",
            clientSecret: "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",
            // callbackURL: "http://localhost:8080/registerGoogle/callback",
            callbackURL: "https://pqshop.herokuapp.com/registerGoogle/callback",
            passReqToCallback   : true
            },
            function(request, accessToken, refreshToken, profile, done) {
                return done(null, profile);
            }
            ));
            next()
    },
    loginGG: function(req,res,next){
        passport.use(new GoogleStrategy({
            clientID: "1067898336377-qb79vp2eoeg8i6ihsgcta36q6gt8ifa2.apps.googleusercontent.com",
            clientSecret: "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",
            // callbackURL: "http://localhost:8080/loginGoogle/callback",
            callbackURL: "https://pqshop.herokuapp.com/loginGoogle/callback",
            passReqToCallback   : true
            },
            function(request, accessToken, refreshToken, profile, done) {
                return done(null, profile);
            }
            ));
            next()
    },
    registerFace: function(req,res,next){
        passport.use(new FacebookStrategy({
            // clientID: "583964342925090",
            // clientSecret: "698e6747f90aa3ae71cff81e81bdbdc1",
            // callbackURL: "http://localhost:8080/registerFacebook/callback",
            

            clientID: "1016845922436221",
            clientSecret: "4051c068556491cb7c137cad1dda8862",
            callbackURL: "https://pqshop.herokuapp.com/registerFacebook/callback",

            profileFields: ['id', 'displayName','name','picture.type(large)'],
          },
          function(accessToken, refreshToken, profile, done) {
            return done(null, profile);
          }
          ));
          next()
    },
    loginFace: function(req,res,next){
        passport.use(new FacebookStrategy({
            // clientID: "583964342925090",
            // clientSecret: "698e6747f90aa3ae71cff81e81bdbdc1",
            // callbackURL: "http://localhost:8080/loginFacebook/callback",

            clientID: "1016845922436221",
            clientSecret: "4051c068556491cb7c137cad1dda8862",
            callbackURL: "https://pqshop.herokuapp.com/loginFacebook/callback",
          },
          function(accessToken, refreshToken, profile, done) {
            return done(null, profile);
          }
          ));
          next()
    }
}