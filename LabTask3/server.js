const express = require("express");
var expressLayouts = require("express-ejs-layouts");
let server = express();
server.set("view engine", "ejs");
server.use(expressLayouts);
server.use(express.static("public"));
server.use(express.urlencoded({ extended: true }));


let adminProductsRouter = require("./routes/admin/product.controller");
server.use(adminProductsRouter); 



server.get("/", (req, res) => {
    res.render("index");
});

server.get("/portfolio", (req, res) => {
    res.render("mid");
});





server.listen(2000,()=>{
    console.log("server started at localhost: 2000");
});

