const express = require("express");
const expressLayouts = require("express-ejs-layouts");
var mongoose = require("mongoose");
const flash = require("connect-flash");
const session = require("express-session");
const passport = require("passport");

const app = express();

//Passport config
require("./config/passport")(passport);

//connect to DB
var db = mongoose
  .connect("mongodb://127.0.0.1:27017/security", { useNewUrlParser: true })
  .then(() => console.log("MongoDB Connection Successful..."))
  .catch((err) => console.log("MongoDB Connection failed : ", err));

// //testing connectivity
// mongoose.connection.once("connected", function () {
//   console.log("Database connected successfully");
// });

//EJS
app.use(expressLayouts);
app.set("view engine", "ejs");

//body parser
app.use(express.urlencoded({ extended: false }));

//Express session
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);

//passport
app.use(passport.initialize());
app.use(passport.session());

//connect flash
app.use(flash());

//global vars
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");

  next();
});

const PORT = process.env.PORT || 5000;

//routes
app.use("/", require("./routes/index"));

app.use("/users", require("./routes/users"));

app.listen(PORT, console.log(`Server started on port ${PORT}`));
