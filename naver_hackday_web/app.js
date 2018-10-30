var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var sassMiddleware = require('node-sass-middleware');
var methodOverride = require('method-override');
var flash = require('connect-flash');

var indexRouter = require('./routes/index');
var trendsRouter = require('./routes/trends');
var crawlerRouter = require('./routes/crawler');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
if (app.get('env') === 'development') {
  app.locals.pretty = true;
}

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// _method를 통해서 method를 변경 for PUT, DELETE
app.use(methodOverride('_method', {methods: ['POST', 'GET']}));

// sass, scss
app.use(sassMiddleware({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  indentedSyntax: false, // true = .sass and false = .scss
  debug: true,
  sourceMap: true
}));

// flash message
app.use(flash()); 

// public 디렉토리에 있는 내용은 static하게 service하도록.
// you must place sass-middleware *before* `express.static` or else it will not work.
app.use(express.static(path.join(__dirname, 'public')));

// Route
app.use('/', indexRouter);
app.use('/trends', trendsRouter);
app.use('/crawler', crawlerRouter);

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
