const express = require("express");
const mongoose = require("mongoose");
var expressLayouts = require("express-ejs-layouts");
let adminProductsRouter = require("./routes/Admin/product.controller");
let adminCategoryRouter = require("./routes/Admin/category.controller");
let userCategoryRouter = require("./routes/user/user.product.controller");
let userAuth = require("./routes/user/auth");
let session = require("express-session");
let authMiddleware = require("./middlewares/auth-middleware");
let server = express();

//using cookie for storing user_id
let cookieParser = require("cookie-parser");
server.use(cookieParser());

// Session middleware for user signup
server.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false, 
        maxAge: 1000 * 60 * 60 * 24, 
    },
}));

//flash messages middleware
const flashMessages = require('./middlewares/flashMessages');
server.use(flashMessages); 



// Middleware for global cart count
server.use((req, res, next) => {
    if (!req.session.cart) req.session.cart = []; 
    res.locals.cartCount = req.session.cart.length; 
    next();
});

//using server for different functions
server.set("view engine", "ejs");
server.use(expressLayouts);
server.use(express.static("public"));
server.use(express.urlencoded({ extended: true }));
server.use(express.json());
// server.use(adminProductsRouter);
server.use(adminCategoryRouter);
server.use(userCategoryRouter);
server.use(userAuth);


//connecting to mongoDB
mongoose.connect("mongodb://127.0.0.1:27017/MernStack")
    .then(() => console.log("connected to database"))
    .catch((err) => console.log("error connecting to database ", err));


// add to cart functionality
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


//adding middleware on home page
server.get("/", authMiddleware, (req, res) => {
    res.render("index");
});

//adding middle_ware on home
let adminMiddleware = require("./middlewares/admin-middleware");
//const { listenerCount, listeners } = require("./models/category.model");
server.use("/", authMiddleware, adminMiddleware, adminProductsRouter);

//poertfolio
server.get("/portfolio", (req, res) => {
    res.render("mid");
});

server.listen(3000, () => {
    console.log("server started at localhost: 3000");
});
