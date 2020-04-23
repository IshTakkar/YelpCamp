var express = require('express');
var router = express.Router;
var Campground = require('../models/campground');


router.get("/campgrounds", (req, res) => {
    Campground.find({}, (err, allCamps) => {
        if (err) {
            console.log(err);
        } else {
            res.render("index", { campgrounds: allCamps, currentUser: req.user});
        }
    });
});

router.post("/campgrounds", (req, res) => {
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

router.get("/campgrounds/new", (req, res) => {
    res.render("form");
});

router.get("/campgrounds/:id", (req, res) => {
    Campground.findById(req.params.id).populate("comments").exec((err, findCampgrounds) => {
        if (err) {
            console.log(err);
        } else {
            res.render("show", {campgrounds: findCampgrounds});
        }
    });
    
});


function isLoggedIn(req, res, next){
    if (req.isAuthenticated()) {
        return next();
    }  
    res.redirect('/login');
};

module.exports = router;