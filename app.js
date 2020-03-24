var express = require('express');
var app = express();
var request = require('request');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
mongoose.connect("mongodb://localhost:27017/yelp_camp", {useNewUrlParser: true});

var campSchema = new mongoose.Schema({
    name: String,
    image: String
});

var Campground = mongoose.model("Campground", campSchema);

// Campground.create({
//     name: "Granite Hill",
//     image: "https://cdn-blog.queensland.com/wp-content/uploads/2014/04/133096.jpg"
// }, (err, camp) => {
//         if (err) {
//             console.log("Error Found.");
//         } else {
//             console.log("New camp added:");
//             console.log(camp);
//    }
// });

app.use(bodyParser.urlencoded({ extended: true }));

app.set("view engine", "ejs");
app.get("/", (req, res) => {
    res.render("landing");
});

app.get("/campgrounds", (req, res) => {
    Campground.find({}, (err, allCamps) => {
        if (err) {
            console.log(err);
        } else {
            res.render("campgrounds", { campgrounds: allCamps });
        }
    });
});

app.post("/campgrounds", (req, res) => {
    var newName = req.body.name;
    var newImage = req.body.image;
    var temp = { name: newName, image: newImage };
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

app.listen(3000, () => {
    console.log("Port opened at 3000");
});