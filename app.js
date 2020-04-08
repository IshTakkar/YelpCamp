var express = require('express');
var app = express();
var request = require('request');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
mongoose.connect("mongodb://localhost:27017/yelp_camp", { useUnifiedTopology: true, useNewUrlParser: true });
var Campground = require('./models/campground');
var seedsDB = require('./seeds');

app.use(bodyParser.urlencoded({ extended: true }));

app.set("view engine", "ejs");

seedsDB();
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

app.get("/campgrounds/:id", (req, res) => {
    Campground.findById(req.params.id).populate("comments").exec((err, findCampgrounds) => {
        if (err) {
            console.log(err);
        } else {
            res.render("show", {campgrounds: findCampgrounds});
        }
    });
    
});

app.listen(3000, () => {
    console.log("Port opened at 3000");
});