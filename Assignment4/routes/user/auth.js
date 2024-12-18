const express = require('express');
const router = express.Router();

//importing required models
const User = require('../../models/user.model'); 
const session = require("express-session");
let cookieParser = require("cookie-parser");
router.use(cookieParser());
router.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false, 
        maxAge: 1000 * 60 * 60 * 24, 
    },
}));

router.use(express.urlencoded({ extended: true }));



// Get login page
router.get('/Authentication/login', (req, res) => {
    res.render('./Authentication/login', {
        layout: false
    }); 
});

// Get signup page
router.get('/Authentication/signup', (req, res) => {
    res.render('./Authentication/signup', {
        layout: false
    });
});

// Handle login POST request
router.post('/Authentication/login', async (req, res) => {
    try {
        let data = req.body;
        let user = await User.findOne({ email: data.email });

        if (!user) {
            req.session.errorMessage = "User does not exist. Please sign up.";
            return res.redirect('/Authentication/signup');
        }

        let isValid = user.password === data.password;
        if (!isValid) {
            req.session.errorMessage = "Invalid password. Please try again.";
            return res.redirect('/Authentication/login');
        }

        req.session.user = user;
        req.session.successMessage = "Successfully logged in!";
        res.redirect('/'); 
    } catch (error) {
        console.error("Login error:", error);
        req.session.errorMessage = "An error occurred during login. Please try again.";
        res.redirect('/Authentication/login');
    }
});

// Handle signup POST request
router.post('/Authentication/signup', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            req.session.errorMessage = "All fields are required.";
            return res.redirect('/Authentication/signup');
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            req.session.errorMessage = "User already exists with this email.";
            return res.redirect('/Authentication/signup');
        }

        const newUser = new User({
            name,
            email,
            password
        });

        await newUser.save();

        req.session.successMessage = "Successfully registered! Please login.";
        res.redirect('/Authentication/login');
    } catch (error) {
        console.error("Error during signup:", error);
        req.session.errorMessage = "Server error. Please try again.";
        res.redirect('/Authentication/signup');
    }
});

// Handle logout GET request
router.get('/Authentication/logout', (req, res) => {
    const user = req.body;
    req.session.user = null; 
    req.session.successMessage = "Successfully logged out!";
    res.redirect('/Authentication/login'); 
});

module.exports = router;




