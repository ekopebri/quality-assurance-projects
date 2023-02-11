'use strict';
require('dotenv').config();
const express = require('express');
const myDB = require('./connection');
const fccTesting = require('./freeCodeCamp/fcctesting.js');
const session = require('express-session');
const passport = require('passport');
const { ObjectId } = require('mongodb');
const bcrypt = require('bcrypt');

const LocalStrategy = require('passport-local');

const app = express();

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  cookie: { secure: false }
}));

app.use(passport.initialize());
app.use(passport.session());

app.set('view engine', 'pug');
app.set('views', './views/pug');
fccTesting(app); //For FCC testing purposes
app.use('/public', express.static(process.cwd() + '/public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

myDB(async client => {
  const myDatabase = await client.db('database').collection('users');

  app.route('/').get((req, res) => {
    res.render('index', {
      title: 'Connected to Database',
      message: 'Please log in',
      showLogin: true,
      showRegistration: true
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

  app.use((req, res, next) => {
    res.status(404)
        .type("text")
        .send("Not Found");
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
}).catch(e => {
  app.route('/').get((req, res) => {
    res.render('index', {title: e, message: "Unable to connect to database"});
  });
});

// Create middleware for ensure if user is authenticated
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }

  res.redirect('/');
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('Listening on port ' + PORT);
});
