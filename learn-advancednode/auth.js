require('dotenv').config();
const passport = require("passport");
const LocalStrategy = require("passport-local");
const bcrypt = require("bcrypt");
const {ObjectId} = require("mongodb");
const GitHubStrategy = require('passport-github').Strategy;

module.exports = function (app, myDatabase) {
    app.use((req, res, next) => {
        res.status(404)
            .type("text")
            .send("Not Found");
    });

    passport.use(new GitHubStrategy({
        clientID: process.env.GITHUB_CLIENT_ID.clientID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: "http://localhost:3000/auth/github/callback"
    }), function (accessToken, refreshToken, profile,cb) {
        console.log(profile);
    });

    passport.use(new LocalStrategy((username, password, done) => {
        myDatabase.findOne({username: username}, (err, user) => {
            console.log(`User ${username} attempted to log in.`);
            if (err) return done(err);
            if (!user) return done(null, user);
            if (!bcrypt.compareSync(password, user.password)) {
                return done(null, false);
            }
            return done(null, user);
        });
    }));

    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser((id, done) => {
        myDatabase.findOne({_id: new ObjectId(id)}, (err, doc) => {
            done(null, doc);
        })
    });
}