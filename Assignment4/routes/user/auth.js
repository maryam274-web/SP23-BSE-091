const express = require('express');
const router = express.Router();
const User = require('../../models/user.model'); // Import the User model
const session = require("express-session");

let cookieParser = require("cookie-parser");
router.use(cookieParser());

// Session middleware (should be before any middleware that uses req.session)
router.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false, // 'true' for HTTPS, 'false' for HTTP
        maxAge: 1000 * 60 * 60 * 24, // 1 day (this ensures session lasts across multiple requests)
    },
}));

// Body parser middleware to handle form data
router.use(express.urlencoded({ extended: true }));

// Get login page
router.get('/Authentication/login', (req, res) => {
    res.render('./Authentication/login', {
        layout: false
    }); // Renders the login.ejs file
});

// Get signup page
router.get('/Authentication/signup', (req, res) => {
    res.render('./Authentication/signup', {
        layout: false
    });
});

// Handle login POST request
router.post('/Authentication/login', async (req, res) => {
    let data = req.body;
    let user = await User.findOne({ email: data.email });

    if (!user) {
        return res.redirect('/Authentication/signup');
    }

    let isValid = user.password === data.password;
    if (!isValid) {
        return res.redirect('/Authentication/login');
    }

    req.session.user = user;
    console.log("Session User after login:", req.session.user);  // Debug log for session state
    res.redirect('/');  // Redirect to home page after successful login
});



// Handle signup POST request
router.post('/Authentication/signup', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if all fields are filled
        if (!name || !email || !password) {
            return res.status(400).send("All fields are required.");
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).send("User already exists with this email.");
        }

        // Create a new user object
        const newUser = new User({
            name,
            email,
            password
        });

        // Save the user to the database
        await newUser.save();

        // Redirect to login page after successful signup
        res.redirect('/Authentication/login');
    } catch (error) {
        console.error("Error during signup:", error);
        res.status(500).send("Server error. Please try again.");
    }
});

module.exports = router;
