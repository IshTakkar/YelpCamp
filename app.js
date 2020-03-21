var express = require('express');
var app = express();
var request = require('request');
app.set("view engine", "ejs");
app.get("/", (req, res) => {
    res.render("landing");
});

app.get("/campgrounds", (req, res) => {
    var campgrounds = [
        {name: "Salmon Creek", image: "http://c.shld.net/rpx/i/s/i/spin/image/spin_prod_1008587612??hei=64&wid=64&qlt=50"},
        {name: "Paharganj", image: "https://cdn-blog.queensland.com/wp-content/uploads/2014/04/133096.jpg"},
        {name: "Lohagarh", image: "https://www.reserveamerica.com/webphotos/racms/articles/images/bca19684-d902-422d-8de2-f083e77b50ff_image2_GettyImages-677064730.jpg"},
    ]
});

app.listen(3000, () => {
    console.log("Port opened at 3000");
});