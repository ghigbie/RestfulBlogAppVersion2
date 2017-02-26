var express        = require("express"),
    app            = express(),
    mongoose       = require("mongoose"),
    bodyParser     = require("body-parser"),
    methodOverride = require("method-override");

//APP CONFIG
mongoose.connect("mongodb://localhost/restful_blog_app");
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));

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
app.get("/blogs/new", function(req, res){
    res.render("new");
});

// CREATE ROUTE
app.post("/blogs", function(req, res){
    //create the blog
    Blog.create(req.body.blog, function(err, newBlog){
        if(err){
            console.log("PROBLEM!")
            res.render("new");
        }else{
            res.redirect("/blogs");
        }
    });
    //then redirect
});

//SHOW ROUTE
app.get("/blogs/:id", function(req, res){
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            console.log("SHOW ROUTE ERROR");
            console.log(err);
            res.redirect("/blogs");
        }else{
            res.render("show", {blog: foundBlog});
        }
    });
});

//EDIT ROUTE
app.get("/blogs/:id/edit", function(req, res){
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            res.redirect("/blogs");
            console.log("EDIT ROUTE ERROR");
        }else{
            res.render("edit", {blog: foundBlog});
        }
    });
});

//UPDATE ROUTE as a PUT REQUEST - this must be overridden
app.put("/blogs/:id", function(req, res){ //this could be a post request, but since we are using RESTFUL routing "put" should be used here
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
        if(err){
            console.log("ERROR IN UPDATE ROUTE");
            res.redirect("/blogs");
        }else{
            res.redirect("/blogs/" + req.params.id);
        }
    });
});

//DESTROY ROUTE as a DELETE REQUEST - this must be overriden
app.delete("/blogs/:id", function(req, res){
    Blog.findByIdAndRemove(req.params.id, function(err){
       if(err){
           console.log("THERE WAS A DELETE ERROR");
           res.redirect("/blogs");
       }else{
           res.redirect("/blogs");
       }
    });
});

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("SERVER IS RUNNING!!!");
});
