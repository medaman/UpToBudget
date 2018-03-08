var GoogleStrategy = require('passport-google-oauth2').Strategy;
var keys = require('./keys.js');


module.exports = (passport, clients) => {


  passport.use(new GoogleStrategy({
      clientID     : keys.google.clientID,
      clientSecret : keys.google.clientSecret,
      callbackURL  : keys.google.callbackURL,
      passReqToCallback : true
    },
    (req, accessToken, refreshToken, profile, done) => {
      process.nextTick(() => {

        clients.findOne({
          where: {
            'google_id': profile.id
          }
        }).then((user)=>{
          if (user){
            return done(null, user.dataValues);
          }
          else {
            // Creates new user
            var newUser = {
              google_id : profile.id,
              email : profile.emails[0].value,
              // token : accessToken,
              client_name : capFL(profile.name.givenName) + ' ' + capFL(profile.name.familyName)
            };
    				clients.create(newUser).then((addedUser,created)=>{
              if (!addedUser) {
                return done(null, false);
              }
              if (addedUser) {
                console.log('addeduser: '+ JSON.stringify(addedUser.dataValues,null,4));
                return done(null, addedUser.dataValues);
              }
            });
          }

        });
      });
    }
  ));

  passport.serializeUser((user, done) => {
    // console.log('SerializeUser: ' + user.id);
    done(null, user.id);
  });

  passport.deserializeUser((obj, done) => {
    // console.log('deserializeUser: ' + obj);
    done(null, obj);
  });

};

function capFL(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
