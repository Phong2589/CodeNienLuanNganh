const passport = require('passport');
const FacebookStrategy = require( 'passport-facebook' ).Strategy;

passport.serializeUser(function(user, done) {
    done(null, user);
  });
  
passport.deserializeUser(function(user, done) {
    done(null, user);
});

 
passport.use(new FacebookStrategy({
  clientID: "553828279017398",
  clientSecret: "e6466b3a0ea7e52d896496563650297d",
  callbackURL: "http://localhost:8080/registerFacebook/callback",
  callbackURL: "https://pqshop.herokuapp.com/registerFacebook/callback",
  passReqToCallback   : true
},
function(accessToken, refreshToken, profile, done) {
  return done(null, profile);
}
));