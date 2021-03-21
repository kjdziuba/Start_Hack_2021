//server setup
const express = require('express');
const path = require('path');
const mysql = require('mysql');
const passport = require('passport');
const session = require('express-session');
const flash = require('express-flash');
const bcrypt = require('bcrypt');

const helsana = require('./helsana_db');

const app = express();
app.set('view-engine', 'ejs');

const server = app.listen(8080, () => {
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
        let sql = 'CREATE TABLE users (ID varchar(255), email varchar(255), username varchar(255), password varchar(255), kcal varchar(255), protein varchar(255), fat varchar(255), carbs varchar(255));';
        con.query(sql, function (err, result) {
            if (err) {
                //console.log(err);
                console.log("table already exists")
            }
            else { console.log("Table created"); }
        });
    }
});




app.get('/', checkAuthenticated, async (req, res) => {
    var activities = await helsana.getActivitiesById(req.user.ID)
    console.log(activities)
    res.render('index.ejs', { kcal: req.user.kcal, fat: req.user.fat, protein: req.user.protein, carbs: req.user.carbs, ikcal: req.user.ikcal, ifat: req.user.ifat, iprotein: req.user.iprotein, icarbs: req.user.icarbs, ac1: activities[0], ac2: activities[1], ac3: activities[2], ac4: activities[3] });
});

app.get('/login', checkNotAuthenticated, (req, res) => {
    res.render('login.ejs');
});

app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname + '/views/sign_up.html'));
});


app.post('/register', async (req, res) => {
    try {
        var data = req.body;
        id = await helsana.getRandomId()
        console.log(data)
        const hashedPassword = await bcrypt.hash(data.password, 10);
        var sql = `INSERT INTO users (ID, email, username, password, kcal, protein, fat, carbs) VALUES ('${id}','${data.email}', '${data.username}', '${hashedPassword}', '0', '0', '0', '0')`;
        console.log(sql)
        con.query(sql, function (err, result) {
            if (err) {
                if (err.code = "ER_DUP_ENTRY") {
                    res.send("<script>alert('It looks like that email already exists! Please use a different email, or log in');window.location.replace(window.location.href);</script>");
                } else {
                    console.log(err);
                    res.send("<script>alert('An error occurred! Yell aggressively at the developers!');window.location.replace(window.location.href);</script>");
                }

            } else {
                console.log("1 record inserted");
                res.redirect('/');
            }
        });
    } catch {
        res.redirect('/register');
    }
});


app.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}))

app.get('/getFood', (req, res) => {
    res.render('food_example.ejs', { title: "nothing", image: "https://static.turbosquid.com/Preview/001204/841/NH/3D-minion-model_600.jpg" })
})

const food_func = require("./food-func")
app.post('/getFood', async (req, res) => {
    data = req.body.foodString;

    food = await food_func(data)

    if (food) {
        res.render('food_example.ejs', { title: food.title, image: food.image });
    } else {
        console.log("wrong")
    }


})

//food recognition
app.get('/guessFood', (req, res) => {
    res.render('index.ejs', { kcal: "0", fat: "0", protein: "0", carbs: "0" })
})

const guess_food = require("./nutrition_by_name")
app.post('/guessFood', async (req, res) => {
    data = req.body.foodString;
    console.log(data)

    food = await guess_food(data)

    req.user.ikcal = food.kcal;
    req.user.ifat = food.fat;
    req.user.iprotein = food.protein;
    req.user.icarbs = food.carbs;

    req.user.kcal += food.kcal;
    req.user.fat += food.fat;
    req.user.protein += food.protein;
    req.user.carbs += food.carbs;

    console.log(food)

    if (food) {
        var activities = await helsana.getActivitiesById(req.user.ID)
        console.log(activities)
        res.render('index.ejs', { kcal: req.user.kcal, fat: req.user.fat, protein: req.user.protein, carbs: req.user.carbs, ikcal: req.user.ikcal, ifat: req.user.ifat, iprotein: req.user.iprotein, icarbs: req.user.icarbs, ac1: activities[0], ac2: activities[1], ac3: activities[2], ac4: activities[3] });
    } else {
        console.log("wrong")
    }


})

app.get('/getUsers', (req, res) => {
    var sql = `SELECT * FROM users`;
    console.log(sql);
    con.query(sql, function (err, result) {
        if (err) {
            console.log(err);
            console.log("error")
        }
        else {
            console.log(result);
        }
    });
})

//drop db
app.get('/dropDB', (req, res) => {
    var sql = `drop table users`;
    console.log(sql);
    con.query(sql, function (err, result) {
        if (err) {
            console.log(err);
            console.log("error")
        }
        else {
            console.log(result);
        }
    });
})


app.use((req, res, next) => {
    res.sendFile(path.join(__dirname + '/views/404.html'));

});


function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        console.log("not auth")
        return res.redirect('/')
    }
    next()
}

function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        console.log("authenticated")
        return next()
    }

    res.redirect('/login')
}