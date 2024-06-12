const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const routes = require('./routes.js');
const logger = require('morgan');
const app = express();
const fs = require('fs');

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));


app.locals.title = 'exhxvibes'
app.locals.strftime = require('strftime');


app.set('port', process.env.PORT || 8998);
app.set('host', process.env.HOST || '0.0.0.0');


//request middleware
app.use(function(req,res,next){
  console.log("Request IP: " + req.url);
  console.log("Request date: " + new Date());
  next();
});
  
var accessLogStream = fs.createWriteStream(path.join(__dirname,'access.log'), {flags:'a'});
app.use(logger('combined', {stream: accessLogStream}));
app.use(express.static(path.join(__dirname, '../public')));

app.use('/', routes);



//default route
app.get((req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});


app.listen(app.get('port'), app.get('host'), ()=>{
    console.log(`server listening on port ${app.get('port')} \n @ ${app.get('host')} \n`);
});


//fallback 
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname,'../public/','404.html'));
})