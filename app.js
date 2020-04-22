var express = require('express');
var app = express();
var request = require('request');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var passport = require('passport');
var LocalStrategy = require('passport-local');
var passportLocalMongoose = require('passport-local-mongoose');
var User = require('./models/user');
mongoose.connect("mongodb://localhost:27017/yelp_camp", { useUnifiedTopology: true, useNewUrlParser: true });
var Campground = require('./models/campground');
var Comment = require('./models/comment');
var seedsDB = require('./seeds');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));

app.set("view engine", "ejs");

app.use(require('express-session')({
    secret: 'Gangadhar hi Shaktimaan hai!',
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());   

//seedsDB();
app.get("/", (req, res) => {
    res.render("landing");
});

app.get("/campgrounds", (req, res) => {
    Campground.find({}, (err, allCamps) => {
        if (err) {
            console.log(err);
        } else {
            res.render("index", { campgrounds: allCamps });
        }
    });
});

app.post("/campgrounds", (req, res) => {
    var newName = req.body.name;
    var newImage = req.body.image;
    var newDesc = req.body.description;
    var temp = { name: newName, image: newImage, description: newDesc};
    Campground.create(temp, (err, camp) => {
        if (err) {
            console.log(err);
        } else {
            console.log("New campground added.");
            console.log(camp);
            res.redirect("/campgrounds");
        }
    });
    
});

app.get("/campgrounds/new", (req, res) => {
    res.render("form");
});

app.post('/campgrounds/:id/comments', (req, res) => {
    Campground.findById(req.params.id, (err, campground) => {
        if (err) {
            console.log(err);
        } else {
            Comment.create(req.body.comment, (err, comment) => {
                if (err) {
                    console.log(err);
                } else {
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect('/campgrounds/' + campground._id);
                }
            });
       }
    });
});

app.get("/campgrounds/:id", (req, res) => {
    Campground.findById(req.params.id).populate("comments").exec((err, findCampgrounds) => {
        if (err) {
            console.log(err);
        } else {
            res.render("show", {campgrounds: findCampgrounds});
        }
    });
    
});



app.get('/campgrounds/:id/comments/new', (req, res) => {
    Campground.findById(req.params.id, (err, campground) => {
        if (err) {
            console.log(err);
        } else{
            res.render('newF', { campgrounds: campground });
        }
    });
});

app.get('/register', (req, res) => {
    res.render('register'); 
});

app.post('/register', (req, res) => {
    User.register(new User({ username: req.body.username }), req.body.password, (err, user) => {
        if (err) {
            console.log(err);
            res.redirect('/register');
        } 
        passport.authenticate('local')(req, res, () => {
            res.redirect('/campgrounds'); 
        });
    }); 
});

app.get('/login', (req, res) => {
    res.render('login'); 
});

app.post('/login', passport.authenticate('local', {
    successRedirect: '/campgrounds',
    failureRedirect: '/login'
}) ,(req, res) => {

});

app.listen(3000, () => {
    console.log("Port opened at 3000");
});