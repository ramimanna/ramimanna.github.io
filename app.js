var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var Regex = require("regex");



var routes = require('./routes/index');
var projects = require('./routes/projects');
var adventure = require('./routes/adventure');
var exploration = require('./routes/exploration')
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.text({ type: 'text/html' }))
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/projects',projects);
app.use('/exploration',exploration);
app.use('/adventure',adventure);

app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


//NODEJS REQUEST PACKAGE:
var request = require('request');
var request = request.defaults({jar: true})

//Request Randomly Generated User
// request('https://randomuser.me/api/', function (error, response, body) {
//   if (!error && response.statusCode == 200) {
//     console.log(JSON.parse(body)["results"][0]); // Show the HTML for the Google homepage. 
//   }
// })

//Request Country data
// var country_string = "china"
// request('https://restcountries.eu/rest/v1/name/'+country_string+'?fullText=true', function (error, response, body) {
//   if (!error && response.statusCode == 200) {
//     console.log(JSON.parse(body)); // Show the HTML for the Google homepage. 
//   }
// })




// request('https://sisapp.mit.edu/ose-rpt/subjectEvaluationSearch.htm', function (error, response, body){
//   if (!error && response.statusCode == 200) {
//     console.log(typeof body);
//     var re = /DOCTYPE/;
//     var str = body;
//     var newstr = str.replace(re, '$2, $1');
//     console.log(newstr);
//   }  
// })


module.exports = app;
