const express=require("express");
let server=express();

server.set("view engine","ejs");

server.use(express.static("public"));


server.get("/", (req, res) => {
    res.render("index");
});

server.get("/mid", (req, res) => {
    res.send(res.render("mid"));
});





server.listen(2000,()=>{
    console.log("server started at localhost: 2000");
});

