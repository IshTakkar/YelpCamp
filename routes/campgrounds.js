var express = require('express');
var router = express.Router();
var Campground = require('../models/campground');
var Comment = require('../models/comment');
var middleware = require('../middleware');

router.get("/", (req, res) => {
    Campground.find({}, (err, allCamps) => {
        if (err) {
            req.flash('error', 'Please wait, there might be an error!');
        } else {
            res.render("index", { campgrounds: allCamps });
        }
    });
});

router.post("/", middleware.isLoggedIn, (req, res) => {
    var newName = req.body.name;
    var newImage = req.body.image;
    var newDesc = req.body.description;
    var newPrice = req.body.price;
    var author = {
        username: req.user.username,
        id: req.user._id
    }
    var temp = { name: newName, image: newImage, description: newDesc, author: author, price: newPrice };
    Campground.create(temp, (err, camp) => {
        if (err) {
            req.flash('error', 'Please wait, there might be an error!');
        } else {
            req.flash('success', 'New campground added!');
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
            req.flash('error', 'Please wait, there might be an error!');
        } else {
            res.render("show", { campgrounds: findCampgrounds });
        }
    });

});

router.get('/:id/edit', middleware.checkCampgroundOwnership,(req, res) => {
    Campground.findById(req.params.id, (err, foundCampground) => {
        if (err) {
            req.flash('error', 'Please wait, there might be an error!');
        } else {
            res.render('edit', { campgrounds: foundCampground });
        }
    });
});


router.put('/:id', middleware.checkCampgroundOwnership,(req, res) => {

    Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, updatedCampground) => {
        if (err) {
            req.flash('error', 'Please wait, there might be an error!');
        } else {
            req.flash('success', 'Campground updated!');
            res.redirect('/campgrounds/' + req.params.id);
        }
    });


});

router.delete('/:id', middleware.checkCampgroundOwnership,(req, res) => {
    Campground.findByIdAndRemove(req.params.id, (err, deletedCampground) => {
        if (err) {
            req.flash('error', 'Please wait, there might be an error!');
        } else {
            Comment.deleteMany({ _id: { $in: deletedCampground.comments } }, (err) => {
                if (err) {
                    req.flash('error', 'Please wait, there might be an error!');
                } else {
                    req.flash('success', 'Campground removed!');
                    res.redirect('/campgrounds');
                }
            })

        }
    });
})




module.exports = router;