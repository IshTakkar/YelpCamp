var mongoose = require('mongoose');
var Campground = require('./models/campground');
var Comment = require('./models/comment');

var seeds = [
    {
        name: 'Canyon Floor',
        image: 'https://images.unsplash.com/photo-1563299796-17596ed6b017?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60',
        description: 'blah blah bleh bloh'
    },
    {
        name: 'Desert Mesa',
        image: 'https://images.unsplash.com/photo-1534187886935-1e1236e856c3?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60',
        description: 'blah blah bleh bloh'
    },
    {
        name: 'Windy Hills',
        image: 'https://images.unsplash.com/photo-1505735754789-3404132203ed?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60',
        description: 'blah blah bleh bloh'
    },
]


async function seedsDB() {
    try {
        await Campground.deleteMany({});
        for (const seed of seeds) {
            let campground = await Campground.create(seed);
            let comment = await Comment.create({
                text: 'This place is great, but I wish there was internet! :(',
                author: 'Ishi'
            });
        }
        campground.comments.push();
        campground.save();
    } catch (err) {
        console.log(err);
        console.log("'Borting!");
    }
};








module.exports = seedsDB;