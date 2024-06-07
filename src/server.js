const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 8998;
require('./routes')(app);

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));
app.use(express.static(path.join(__dirname, '../public/')));

let todos = [
    { id: 1, task: 'Learn HTMX' },
    { id: 2, task: 'Feed Cat' },
];

module.exports = todos;
