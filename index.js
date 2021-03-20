//server setup
const express = require('express');
const path = require('path');
const mysql = require('mysql');
const passport = require('passport');
const session = require('express-session');
const flash = require('express-flash');
const bcrypt = require('bcrypt');

const app = express();

const server = app.listen(8080, () => {
    console.log('listening to requests at 8000');
});

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


//db set up
let con = mysql.createConnection({
    host: "stewarts.database.windows.net",
    port: 1433,
    user: "krzysztof",
    password: "lots$redBulls",
    database: "starthack_2021",
    connectTimeout: 30000
});


con.connect(function (err, result) {
    if (err) {
        console.log(err);
    } else {
        console.log("Connected to MySQL!");
        con.query("CREATE DATABASE mydb", function (err, result) {
            if (err) { console.log("Database already exists"); }
            else { console.log("Database created"); }
        });

        sql = "CREATE TABLE users (id VARCHAR(255), email VARCHAR(255), password VARCHAR(255), username VARCHAR(255) PRIMARY KEY(email))";
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

app.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname + '/views/sign_up.html'));
});


app.post('/signup',async (req,res) =>{
    try{
        var data = req.body;
        id = Date.now().toString()
        const hashedPassword = await bcrypt.hash(data.pwd, 10);
        var sql = `INSERT INTO users (id, email, password, username) VALUES ('${id}','${email}','${data.password}','${data.username}')`;
        con.query(sql, function (err, result) {
            if(err){
                if(err.code="ER_DUP_ENTRY"){
                    res.redirect('/signup');
                }else{console.log(err);
                    res.send("<script>alert('something went wrong');window.location.replace(window.location.href);</script>"); //TESTING ONLY
                }
                
            }else{
                res.redirect('/login');
            }
        });
    }catch{
        res.redirect('/signup');
    }
});

// app.post('/signin', checkNotAuthenticated, passport.authenticate('local', {
//     successRedirect: '/',
//     failureRedirect: '/signin',
//     failureFlash: true
//   }))