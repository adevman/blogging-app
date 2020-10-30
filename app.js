var express = require('express');
var bodyParser = require('body-parser');
var expressSanitizer = require("express-sanitizer")
var mongoose = require('mongoose');
var methodOverride = require('method-override');
var app = express();

mongoose.connect("mongodb://localhost/restfull_blog_app",{useNewUrlParser:true,useUnifiedTopology:true});
app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(expressSanitizer());
app.use(methodOverride('_method'));


var blogSchema = new mongoose.Schema({
    title:String,
    image:String,
    body:String,
    created:{type:Date,default:Date.now}
})
var Blog = mongoose.model("Blog",blogSchema);

// Blog.create({
//     title:"Dog",
//     image:"https://www.sciencemag.org/sites/default/files/styles/article_main_large/public/dogs_1280p_0.jpg?itok=cnRk0HYq",
//     body:"fur"
// })


//Restfull Routing
app.get('/',(req,res)=>{
    res.redirect('/blogs')
})

//INDEX
app.get('/blogs',(req,res)=>{
    Blog.find({},(err,allBlog)=>{
        if(err){
            console.log(err);
        } else {
            res.render("index",{allBlog:allBlog});
        }
    })
})

//NEW
app.get('/blogs/new',(req,res)=>{
    res.render('new');
})

//CREATE
app.post('/blogs',(req,res)=>{
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.create(req.body.blog,(err,newBlog)=>{
        if(err){
            res.render('new');
        } else {
            res.redirect('/blogs');
        }
    })
})

//SHOW
app.get('/blogs/:id',(req,res)=>{
    Blog.findById(req.params.id,(err,foundBlog)=>{
        if(err){
            res.redirect('/blogs');
        } else {
            res.render('show',{blog:foundBlog});
        }
    })
})

app.listen('4030',function(req,res){
    console.log("SERVER IS IN GOOD CONDITION");
})