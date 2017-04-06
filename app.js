var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var app = express();
var api = require('./api');
var fs = require('fs');
var os = require('os');
var ifaces = os.networkInterfaces();
var ip = null;
var json = null;
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

Object.keys(ifaces).forEach(function (ifname) {
  var alias = 0;

  ifaces[ifname].forEach(function (iface) {
    if ('IPv4' !== iface.family || iface.internal !== false) {
      // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
      return;
    }

    if (alias >= 1) {
      // this single interface has multiple ipv4 addresses
    } 
    else {
      ip = iface.address
    }
    ++alias;
  });
});
json = {"local_endpoint":"http://"+ip+':'+process.env.PORT+'/'};
fs.writeFile("frontend/config.json", JSON.stringify(json), 'utf8', function(err){}); 


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
