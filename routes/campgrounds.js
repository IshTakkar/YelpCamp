var express = require('express');
var router = express.Router();
var Campground = require('../models/campground');


router.get("/", (req, res) => {
    Campground.find({}, (err, allCamps) => {
        if (err) {
            console.log(err);
        } else {
            res.render("index", { campgrounds: allCamps});
        }
    });
});

router.post("/", isLoggedIn,(req, res) => {
    var newName = req.body.name;
    var newImage = req.body.image;
    var newDesc = req.body.description;
    var author = {
        username: req.user.username,
        id: req.user._id
    }
    var temp = { name: newName, image: newImage, description: newDesc, author: author};
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

router.get("/new", isLoggedIn,(req, res) => {
    res.render("form");
});

router.get("/:id", (req, res) => {
    Campground.findById(req.params.id).populate("comments").exec((err, findCampgrounds) => {
        if (err) {
            console.log(err);
        } else {
            res.render("show", {campgrounds: findCampgrounds});
        }
    });
    
});

router.get('/:id/edit', (req, res) => {
    res.render('edit');
});


function isLoggedIn(req, res, next){
    if (req.isAuthenticated()) {
        return next();
    }  
    res.redirect('/login');
}

module.exports = router;