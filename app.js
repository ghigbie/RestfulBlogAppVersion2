var express = require("express"),
    app = express(),
    mongoose = require("mongoose"),
    bodyParser = require("body-parser");
    
mongoose.connect("mongodb://localhost/restful_blog_app");
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

// Mongoose/modle config
var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {
        type: Date, 
        default: Date.now()
    }
});
var Blog = mongoose.model("Blog", blogSchema);
    
//RESTFUL ROUTES

app.get("/", function(req, res){
    res.redirect("/blogs");
})

//INDEX ROUTE
app.get("/blogs", function(req, res){
    Blog.find({}, function(err, blogs){
       if(err){
             console.log("ERROR IN /blogs");
             console.log("ERROR!");
           }else{
              res.render("index", {blogs: blogs});
           }
       });       
});
// NEW ROUTE
app.get("/bolgs/new" function(req, res){
    res.render("");
})

// CREATE ROUTE

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("SERVER IS RUNNING!!!");
});
