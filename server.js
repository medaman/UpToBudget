const express = require("express");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
// const expressValidator = require('express-validator');
// const cookieParser = require('cookie-parser');
const keys = require('./config/keys.js');
const path = require("path");

//auth packages
// const session = require('express-session');
// const passport = require( 'passport' );

const db = require('./models');
db.sequelize.sync();
// db.sequelize.sync({ force : true }); // Forces server to drop db if exists and recreate it.

const app = express();
const PORT = process.env.PORT || 3001;

// Sets up the Express app to handle data parsing
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: "application/vnd.api+json" }));
// app.use(expressValidator());
// app.use(cookieParser());
app.use(methodOverride("_method"));

// Passport and Sessions
// app.use(session({
//   secret: keys.session_key, // random generated string
//   resave: false, // save a session when a change occured
//   saveUnitialized: false // create cookies/sessions only when logged in
// }));


// app.use( passport.initialize());
// app.use( passport.session());
// require("./config/passport.js")( passport, db.clients );

// Import routes and give the server access to them.
require("./routes/api-routes.js")(app,db);
// require("./routes/api-routes.js")(app,db,passport);

// Serve up static assets (usually on heroku)
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
  // Send every request to the React app
  // Define any API routes before this runs
  // app.get("*", function(req, res) {
  //   res.sendFile(path.join(__dirname, "./client/build/index.html"));
  // });
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}else{
  app.use(express.static("client/build"));
}


// Set Handlebars.
// const exphbs = require("express-handlebars");
// app.engine("handlebars", exphbs({ defaultLayout: "main" }));
// app.set("view engine", "handlebars");
// app.get('/',(req,res)=>{
//   res.render('index',{});
// });



app.listen(PORT, function() {
  console.log(`🌎 ==> Server now on port ${PORT}!`);
});
