module.exports = function(request, response, next) {
    if (!request.user) {
        request.flash("error", "Please log in first.");
        response.redirect("/auth/login");
    }
    else {
        next();
    }
}