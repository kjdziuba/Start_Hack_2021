//server setup
const express = require('express');
const path = require('path');

const app = express();

const server = app.listen(8080, () => {
    console.log('listening to requests at 8000');
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
