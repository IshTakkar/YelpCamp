var express = require('express');
var router = express.Router();
var Campground = require('../models/campground');
var Comment = require('../models/comment');
var middleware = require('../middleware');

router.get("/", (req, res) => {
    Campground.find({}, (err, allCamps) => {
        if (err) {
            console.log(err);
        } else {
            res.render("index", { campgrounds: allCamps });
        }
    });
});

router.post("/", middleware.isLoggedIn, (req, res) => {
    var newName = req.body.name;
    var newImage = req.body.image;
    var newDesc = req.body.description;
    var author = {
        username: req.user.username,
        id: req.user._id
    }
    var temp = { name: newName, image: newImage, description: newDesc, author: author };
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

router.get("/new", middleware.isLoggedIn, (req, res) => {
    res.render("form");
});

router.get("/:id", (req, res) => {
    Campground.findById(req.params.id).populate("comments").exec((err, findCampgrounds) => {
        if (err) {
            console.log(err);
        } else {
            res.render("show", { campgrounds: findCampgrounds });
        }
    });

});

router.get('/:id/edit', middleware.checkCampgroundOwnership,(req, res) => {
    Campground.findById(req.params.id, (err, foundCampground) => {
        if (err) {
            console.log(err);
        } else {
            res.render('edit', { campgrounds: foundCampground });
        }
    });
});


router.put('/:id', middleware.checkCampgroundOwnership,(req, res) => {

    Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, updatedCampground) => {
        if (err) {
            console.log(err);
        } else {
            res.redirect('/campgrounds/' + req.params.id);
        }
    });


});

router.delete('/:id', middleware.checkCampgroundOwnership,(req, res) => {
    Campground.findByIdAndRemove(req.params.id, (err, deletedCampground) => {
        if (err) {
            console.log(err);
        } else {
            Comment.deleteMany({ _id: { $in: deletedCampground.comments } }, (err) => {
                if (err) {
                    comsole.log(err);
                } else {
                    res.redirect('/campgrounds');
                }
            })

        }
    });
})




module.exports = router;