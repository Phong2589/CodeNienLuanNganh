const passport = require('passport');
const FacebookStrategy = require( 'passport-facebook' ).Strategy;

passport.serializeUser(function(user, done) {
    done(null, user);
  });
  
passport.deserializeUser(function(user, done) {
    done(null, user);
});

 
// passport.use(new FacebookStrategy({
//   clientID: "583964342925090",
//   clientSecret: "698e6747f90aa3ae71cff81e81bdbdc1",
//   callbackURL: "http://localhost:8080/registerFacebook/callback",
//   // callbackURL: "https://pqshop.herokuapp.com/registerFacebook/callback",
// },
// function(accessToken, refreshToken, profile, done) {
//   return done(null, profile);
// }
// ));