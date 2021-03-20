//server setup
const express = require('express');
const path = require('path');
const mysql = require('mysql');
const passport = require('passport');
const session = require('express-session');
const flash = require('express-flash');
const bcrypt = require('bcrypt');

const initialize = require('./passport-config');

initialize(
    passport,
    email => users.find(user => user.email === email),
    id => users.find(user => user.id === id)
)

const app = express();

const server = app.listen(8081, () => {
    console.log('listening to requests at 8000');
});

//allows direct accessof variables in forms
app.use(express.urlencoded({ extended: false }));

//makes redirects based on success/fail 
app.use(flash());
//sets cookies
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize());
app.use(passport.session());

//static files
app.use(express.static('public'));

const users = []


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/views/main_page.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname + '/views/login.html'));
});

app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname + '/views/sign_up.html'));
});




app.post('/register', checkNotAuthenticated, async (req, res) => {
    try {
      const hashedPassword = await bcrypt.hash(req.body.password, 10)
      users.push({
        id: Date.now().toString(),
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword
      })
      res.redirect('/login')
    } catch {
      res.redirect('/register')
    }
  })
  

  app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
  }))


function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return res.redirect('/')
    }
    next()
  }

  function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next()
    }
  
    res.redirect('/login')
  }