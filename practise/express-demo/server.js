const express = require("express");
let server = express();

server.set("view engine", "ejs");

server.use(express.static("public"));

server.get("/about-me", (req, res) => {
  res.render("about-me");
});
server.get("/", (req, res) => {
  res.send(res.render("homepage"));
});

server.listen(1000, () => {
  console.log(`Server Started at localhost:1000`);
});