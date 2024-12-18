module.exports = (req, res, next) => {
    // Pass flash messages from the session to res.locals for easy access in templates
    res.locals.successMessage = req.session.successMessage || null;
    res.locals.errorMessage = req.session.errorMessage || null;

    // Clear the messages after they are passed to the template
    req.session.successMessage = null;
    req.session.errorMessage = null;

    next();
};
