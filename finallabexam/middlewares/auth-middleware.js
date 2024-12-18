// module.exports = async function (req, res, next) {
//     if (!req.session.user) return res.redirect("./Authentication/login");
//     else next();
// };

let authMiddleware = async (req, res, next) => {
    console.log("Session User:", req.session.user); // Log the session data
    if (!req.session.user) {
       return res.redirect("/Authentication/login"); // Redirect if user is not logged in
    }
    next(); // Allow to proceed if user is logged in
};

module.exports=authMiddleware;