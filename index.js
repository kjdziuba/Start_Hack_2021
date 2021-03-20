//server setup
const express = require('express');
const path = require('path');
const mysql = require('mysql');
const passport = require('passport');
const session = require('express-session');
const flash = require('express-flash');
const bcrypt = require('bcrypt');

const app = express();

const server = app.listen(8081, () => {
    console.log('listening to requests at 8000');
});

//allows direct accessof variables in forms
app.use(express.urlencoded({ extended: false }));

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

//passport set up
const initializePassport = require('./passport-config');
initializePassport(passport);

//static files
app.use(express.static('public'));


//db set up
var con = mysql.createConnection({
    host: "***REMOVED***",
    user: "***REMOVED***",
    password: "***REMOVED***",
    database: "somedb",
    port: '3306',
    ssl: true
});


con.connect(function (err) {
    if (err) {
        console.log("!!! Cannot connect !!! Error:");
        console.log(err.stack)
    }
    else {
        console.log("Connection established.");
        let sql = 'CREATE TABLE users (ID int, email varchar(255), username varchar(255), password varchar(255) );';
        con.query(sql, function (err, result) {
            if (err) {
                //console.log(err);
                console.log("table already exists")
            }
            else { console.log("Table created"); }
        });
    }
});




app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/views/main_page.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname + '/views/login.html'));
});

app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname + '/views/sign_up.html'));
});


app.post('/register',async (req,res) =>{
    try{
        var data = req.body;
        id = Date.now().toString()
        console.log(data)
        const hashedPassword = await bcrypt.hash(data.password, 10);
        var sql = `INSERT INTO users (ID, email, username, password) VALUES (${id},'${data.email}', '${data.username}', '${hashedPassword}')`;
        console.log(sql)
        con.query(sql, function (err, result) {
            if(err){
                if(err.code="ER_DUP_ENTRY"){
                    res.send("<script>alert('It looks like that email already exists! Please use a different email, or log in');window.location.replace(window.location.href);</script>");
                }else{console.log(err);
                    res.send("<script>alert('An error occurred! Yell aggressively at the developers!');window.location.replace(window.location.href);</script>");
                }
                
            }else{
                console.log("1 record inserted");
                res.redirect('/');
            }
        });
    }catch{
        res.redirect('/register');
    }
});


app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}))

app.get('/getUsers', (req, res) => {
    var sql = `SELECT * FROM users`;
    console.log(sql);
    con.query(sql, function (err, result) {
        if (err) {
            //console.log(err);
            console.log("error")
        }
        else { 
            console.log(result); 
        }
    });
})


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