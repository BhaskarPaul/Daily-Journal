const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");
const _ = require("lodash");
require("dotenv/config");

const homeStartingContent =
    "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent =
    "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent =
    "Hey, I'm  Bhaskar Paul, a MERN stack developer from Kolkata, India. I'm a 3rd year college student majoring in Computer Science and Engineering. Here are my contact details:";

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// database
mongoose.connect(
    process.env.DB_URI,
    { useNewUrlParser: true, useUnifiedTopology: true },
    () => console.log("database connected ... ")
);

const blogSchema = new mongoose.Schema({
    title: String,
    body: String,
});

const Blog = mongoose.model("blog", blogSchema);

const blog = new Blog({
    title: "",
    body: "",
});

const blogArray = [blog];

//  Home route
app.get("/", (req, res) => {
    Blog.find({}, (err, blog) => {
        if (blog.length !== 0) {
            res.render("home", {
                homeStartingContent: homeStartingContent,
                posts: blog,
            });
            // res.redirect("/");
        } else {
            Blog.insertMany(blogArray, (e, docs) => {
                console.log(e);
            });
            res.render("home", {
                homeStartingContent: homeStartingContent,
                posts: [],
            });
        }
    });
});

//  Contact route
app.get("/contact", (req, res) => {
    res.render("contact", { contactContent: contactContent });
});

//  about page
app.get("/about", (req, res) => {
    res.render("about", { aboutContent: aboutContent });
});

//  Compose route
app.get("/compose", (req, res) => {
    res.render("compose");
});

app.post("/compose", (req, res) => {
    const postTitle = req.body.postTitle;
    const postBody = req.body.postBody;
    const blog = new Blog({
        title: postTitle,
        body: postBody,
    });
    blog.save();
    res.redirect("/");
});

//  post route
app.get("/post/:id", (req, res) => {
    const routeId = req.params.id;
    Blog.findById(routeId, (e, blog) => {
        res.render("post", { heading: blog.title, content: blog.body });
    });
});

let port = process.env.PORT;
if (port == null || port == "") {
    port = 8000;
}

app.listen(port, function () {
    console.log("Server has started successfully");
});
