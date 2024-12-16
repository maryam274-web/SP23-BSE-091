const express = require("express");
const mongoose=require("mongoose");
var expressLayouts = require("express-ejs-layouts");
let adminProductsRouter = require("./routes/Admin/product.controller");
let adminCategoryRouter = require("./routes/Admin/category.controller");
let userCategoryRouter = require("./routes/user/user.product.controller");


let server = express();
server.set("view engine", "ejs");
server.use(expressLayouts);
server.use(express.static("public"));
server.use(express.urlencoded({ extended: true }));
server.use(express.json());
server.use(adminProductsRouter);
server.use(adminCategoryRouter);
server.use(userCategoryRouter);



mongoose.connect("mongodb://127.0.0.1:27017/MernStack")
.then(()=>console.log("connected to database"))
.catch((err)=>console.log("error connecting to database ",err));




server.get("/", (req, res) => {
    res.render("index");
});

server.get("/portfolio", (req, res) => {
    res.render("mid");
});





server.listen(3000,()=>{
    console.log("server started at localhost: 3000");
});

