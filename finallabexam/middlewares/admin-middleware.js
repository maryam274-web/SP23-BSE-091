module.exports = async function (req, res, next) {
    if (!req.session.user?.role.includes("admin")) return res.redirect("/Authentication/login");
    else next();
};