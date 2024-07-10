const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const logger = require('morgan');
const fs = require('fs');

const apiRoutes = require('./api-routes.js');

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));


app.locals.title = 'exhxvibes'
app.locals.strftime = require('strftime');


app.set('port', process.env.PORT || 8998);
app.set('host', process.env.HOST || '0.0.0.0');


// Custom Morgan token for remote address
logger.token('remote-addr', function (req) {
  return req.headers['x-forwarded-for'] || req.socket.remoteAddress;
});




// Custom Morgan format middleware
app.use(logger(':remote-addr - :method :url :status :res[content-length] - :response-time ms'));
let connections = 0;
// Middleware to count connections
app.use((req, res, next) => {
  console.log("Request IP: " + req.url);
  console.log("Request date: " + new Date());
  connections++;
  console.log(`Total connections: ${connections}`);
  res.on('finish', () => {
    connections--;
    console.log(`Total connections: ${connections}`);
  });
  res.on('close', () => {
    console.log('close');
  });
  next();
});
  
var accessLogStream = fs.createWriteStream(path.join(__dirname,'access.log'), {flags:'a'});
app.use(logger('combined', {stream: accessLogStream}));


app.use('/api', apiRoutes);



//default route
app.get((req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});
app.use(express.static(path.join(__dirname, '../public')));

//todo front end
app.get('/todos',(req, res) => {
  res.sendFile(path.join(__dirname, '../public','views','todos.html'));
});

//wave vibes front end
app.get('/waves',(req, res) => {
  res.sendFile(path.join(__dirname, '../public','views','waves.html'));
});

app.listen(app.get('port'), app.get('host'), ()=>{
    console.log(`server listening on port ${app.get('port')} \n @ ${app.get('host')} \n`);
});


//fallback 
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname,'../public/','404.html'));
})