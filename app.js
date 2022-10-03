var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var articleRouter = require('./routes/article');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// session تكوين اعتراض تسجيل الدخول   
app.use(session({
  secret: 'my project',
  resave: false,
  saveUninitialized: true,
  cookie: {maxAge: 1000 * 60 * 60 *24}  //يحدد مدة صلاحية جلسة تسجيل الدخول
}))

//اعتراض تسجيل الدخول
app.get('*', (req, res, next) => {
  var username = req.session.username;
  var path = req.path
  console.log('session', username);
  if (path !== '/login' && path !== '/regist') {
    if (!username) {
      res.redirect('/login');
    }
  }
  next();
} )

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/article', articleRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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

module.exports = app;
