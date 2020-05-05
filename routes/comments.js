var express = require('express');
var router = express.Router({mergeParams: true});
var Comment = require('../models/comment');
var Campground = require('../models/campground');
var middleware = require('../middleware');

router.post('/', middleware.isLoggedIn, (req, res) => {
    Campground.findById(req.params.id, (err, campground) => {
        if (err) {
            console.log(err);
        } else {
            Comment.create(req.body.comment, (err, comment) => {
                if (err) {
                    console.log(err);
                } else {
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect('/campgrounds/' + campground._id);
                }
            });
       }
    });
});

router.get('/new', middleware.isLoggedIn,(req, res) => {
    Campground.findById(req.params.id, (err, campground) => {
        if (err) {
            console.log(err);
        } else{
            res.render('newF', { campgrounds: campground});
        }
    });
});

router.get('/:comment_id/edit', middleware.checkCommentOwnership,(req, res) => {
    Comment.findById(req.params.comment_id, (err, foundComment) => {
        if (err) {
            console.log(err);
        } else {
            res.render('newE', {comment: foundComment, campground_id: req.params.id});
        }
    })
});


router.put('/:comment_id', middleware.checkCommentOwnership,(req, res) => {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, foundComment) => {
        if (err) {
            console.log(err);
        } else {
            res.redirect('/campgrounds/' + req.params.id);
        }
    });
});

router.delete('/:comment_id', middleware.checkCommentOwnership,(req, res) => {
    Comment.findByIdAndRemove(req.params.comment_id, (err, deletedComment) => {
        if (err) {
            console.log(err);
        } else {
            res.redirect('/campgrounds/' + req.params.id);
        }
    });
});



module.exports = router;