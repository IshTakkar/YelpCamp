var express = require('express');
var app = express();
var request = require('request');
var bodyParser = require('body-parser');
var campgrounds = [
    { name: "Salmon Creek", image: "http://c.shld.net/rpx/i/s/i/spin/image/spin_prod_1008587612??hei=64&wid=64&qlt=50" },
    { name: "Paharganj", image: "https://cdn-blog.queensland.com/wp-content/uploads/2014/04/133096.jpg" },
    { name: "Lohagarh", image: "https://www.reserveamerica.com/webphotos/racms/articles/images/bca19684-d902-422d-8de2-f083e77b50ff_image2_GettyImages-677064730.jpg" },
];

app.use(bodyParser.urlencoded({ extended: true }));

app.set("view engine", "ejs");
app.get("/", (req, res) => {
    res.render("landing");
});

app.get("/campgrounds", (req, res) => {
    res.render("campgrounds", {campgrounds: campgrounds});
});

app.post("/campgrounds", (req, res) => {
    var newName = req.body.name;
    var newImage = req.body.image;
    var temp = { name: newName, image: newImage };
    campgrounds.push(temp);
    res.redirect("/campgrounds");
});

app.get("/campgrounds/new", (req, res) => {
    res.render("form");
});

app.listen(3000, () => {
    console.log("Port opened at 3000");
});