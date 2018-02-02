var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var users = require('./routes/users');
var room = require('./routes/room');

var app = express();
app.io = require('socket.io')();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);
app.use('/room', room);

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
  res.render('error');
});

var userList = [];
app.io.on('connection', function (socket) {


  socket.on('new user', function(user){
    var already = false
      for (i = 0; i < userList.length; i++) {
          var tmp = userList[i];
          if (tmp.email == user.email) {
            already = true;
            break;
          }
      }
    
    if (!already) {
      console.log(1)
      user.socket = socket.id;
      userList.push(user);
    }
    app.io.emit('users', userList);
  });

  socket.on('new message', function(msg, callback){
      console.log(msg);
      var newMsg = {
        from: msg.name, 
        message: msg.message,
        email: msg.email,
        toEmail: msg.toEmail, 
        date: msg.date
      }
      app.io.emit('chat message', newMsg);
  });

});

module.exports = app;
