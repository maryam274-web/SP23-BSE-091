const express = require("express");
const mongoose = require("mongoose");
var expressLayouts = require("express-ejs-layouts");
let adminProductsRouter = require("./routes/Admin/product.controller");
let adminCategoryRouter = require("./routes/Admin/category.controller");
let userCategoryRouter = require("./routes/user/user.product.controller");
let userAuth = require("./routes/user/auth");
const session = require("express-session");
let authMiddleware = require("./middlewares/auth-middleware");
let siteMiddleware = require("./middlewares/site-middleware");

let server = express();
let cookieParser = require("cookie-parser");
server.use(cookieParser());

// Session middleware (should be before any middleware that uses req.session)
server.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false, // 'true' for HTTPS, 'false' for HTTP
        maxAge: 1000 * 60 * 60 * 24, // 1 day (this ensures session lasts across multiple requests)
    },
}));
// Middleware for global cart count
server.use((req, res, next) => {
    if (!req.session.cart) req.session.cart = []; // Ensure session cart exists
    res.locals.cartCount = req.session.cart.length; // Set global cartCount
    next();
});


server.set("view engine", "ejs");
server.use(expressLayouts);
server.use(express.static("public"));
server.use(express.urlencoded({ extended: true }));
server.use(express.json());
server.use(adminProductsRouter);
server.use(adminCategoryRouter);
server.use(userCategoryRouter);
server.use(userAuth);
server.use(siteMiddleware);

mongoose.connect("mongodb://127.0.0.1:27017/MernStack")
    .then(() => console.log("connected to database"))
    .catch((err) => console.log("error connecting to database ", err));


server.post('/furniture', (req, res) => {
    const { productId } = req.body;

    // Add productId to cart in session
    req.session.cart.push(productId);

    // Optionally count cart items
    req.session.cartCount = req.session.cart.length;

    // Redirect back to furniture page or respond with success
    res.redirect('/furniture');
});



server.get('/furniture', (req, res) => {
    const products = [ /* Array of products fetched from database */ ];
    const cartCount = req.session.cart ? req.session.cart.length : 0;
  
    res.render('furniture', { products, cartCount });
});

server.get("/", authMiddleware, (req, res) => {
    res.render("index");
});

server.get("/portfolio", (req, res) => {
    res.render("mid");
});





server.listen(3000, () => {
    console.log("server started at localhost: 3000");
});
