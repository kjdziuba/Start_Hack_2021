//server setup
const express = require('express');

const app = express();

const server = app.listen(8000, () => {
    console.log('listening to requests at 8000');
});

