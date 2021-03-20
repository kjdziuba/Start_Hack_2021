//server setup
const express = require('express');
const path = require('path');

const app = express();

const server = app.listen(8080, () => {
    console.log('listening to requests at 8000');
});


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/views/index.html'));
});
