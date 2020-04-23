var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var passport = require('passport');
var LocalStrategy = require('passport-local');
var User = require('./models/user');
mongoose.connect("mongodb://localhost:27017/yelp_camp", { useUnifiedTopology: true, useNewUrlParser: true });
var campgroundRoutes = require('./routes/campgrounds');
var commentRoutes = require('./routes/comments');
var indexRoutes = require('./routes/index');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));
app.use(indexRoutes);
app.use(campgroundRoutes);
app.use(commentRoutes);
app.set("view engine", "ejs");

app.use(require('express-session')({
    secret: 'Gangadhar hi Shaktimaan hai!',
    resave: false,
    saveUninitialized: false
}));
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    next();
});
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());   


app.listen(3000, () => {
    console.log("Port opened at 3000");
});