const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const routes = require('./routes.js');

const app = express();
const PORT = 8998;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));

app.use(express.static(path.resolve(__dirname, '../public/')));
app.use('/', routes);

app.locals.title = 'exhxvibes'
app.locals.strftime = require('strftime');


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
  });
  

app.listen(PORT, () => {
    console.log(`server ${app.locals.title} is running on port ${PORT}`)
})