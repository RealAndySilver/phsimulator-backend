var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var app = express();
var api = require('./api');

//This function allows Angular JS App to consume the service without restriction
var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,UNLOCK,PURGE');
    res.header(	'Access-Control-Allow-Headers', 
    			'Content-Type , content-type, Authorization, Content-Length, X-Requested-With, type, token,Cache-Control,If-Modified-Since,if-modified-since, pragma, application/json, text/plain, */*');
    if ('OPTIONS' == req.method) {
      res.sendStatus(200);
    }
    else{
	  next();  
    }
}

// uncomment after placing your favicon in /public
app.use(allowCrossDomain);
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/api', api);
app.use(express.static(path.join(__dirname, 'frontend')));
process.env.PORT = 3200;


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
});

module.exports = app;
