var express = require('express');
var router = express.Router;
var Comment = require('../models/comment');
var Campground = require('../models/campground');

router.post('/campgrounds/:id/comments', isLoggedIn, (req, res) => {
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

router.get('/campgrounds/:id/comments/new', isLoggedIn,(req, res) => {
    Campground.findById(req.params.id, (err, campground) => {
        if (err) {
            console.log(err);
        } else{
            res.render('newF', { campgrounds: campground });
        }
    });
});


function isLoggedIn(req, res, next){
    if (req.isAuthenticated()) {
        return next();
    }  
    res.redirect('/login');
}

module.exports = router;