const passport = require("passport");
const bcrypt = require("bcrypt");

module.exports = function (app, myDatabase) {
    app.route('/').get((req, res) => {
        res.render('index', {
            title: 'Connected to Database',
            message: 'Please log in',
            showLogin: true,
            showRegistration: true,
            showSocialAuth: true
        });
    });

    app.route("/login")
        .post(passport.authenticate('local', {failureRedirect: '/'}), (req, res) => {
            res.redirect('/profile');
        });

    app.route('/profile')
        .get(ensureAuthenticated, (req, res) => {
            res.render('profile', {
                username: req.user.username
            });
        });

    app.route("/logout")
        .get((req, res) => {
            req.logout();
            res.redirect('/')
        });

    app.route("/register")
        .post((req, res, next) => {
            myDatabase.findOne({username: req.body.username}, (err, user) => {
                if (err) {
                    next(err);
                } else if (user) {
                    res.redirect('/');
                } else {
                    // Hash password before save to database
                    const hash = bcrypt.hashSync(req.body.password, 12);

                    myDatabase.insertOne({
                        username: req.body.username,
                        password: hash
                    }, (err, doc) => {
                        if (err) {
                            res.redirect('/');
                        } else {
                            next(null, doc.ops[0]);
                        }
                    })
                }
            })
        }, passport.authenticate('local', { failureRedirect: '/' }), (req, res, next) => {
            res.redirect('/profile');
        });

    app.route("/auth/github")
        .get(passport.authenticate('github'));

    app.route("/auth/github/callback")
        .get(passport.authenticate('github', { failureRedirect: '/' }), (req, res) => {
            res.redirect('/profile');
        });
}

// Create middleware for ensure if user is authenticated
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }

    res.redirect('/');
}