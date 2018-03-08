const randomString = require('randomstring');
module.exports = {
  google : {
    clientID: '393852577124-du4hrae8odanu37sh8cgacmhk3hmolvg.apps.googleusercontent.com',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "https://fbaprojecst.herokuapp.com/auth/google/callback"
    // callbackURL: "http://localhost:3001/auth/google/callback"
  },
  SENDGRID_API_KEY : process.env.SENDGRID_API_KEY,
  session_key : randomString.generate()
}
