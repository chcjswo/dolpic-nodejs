var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var flash = require('connect-flash');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var util = require('util');

var mongo = require('mongodb');
var mongoose = require('mongoose');

var passport = require('passport');
var LocalStrategy = require('passport-local'),Strategy;

// OS 환경 변수 사용하기
// var dbInfo = util.format('mongodb://%s:%s@%s:%s/%s',
// 												process.env['DB_USER'],
// 												process.env['DB_PASS'],
// 												process.env['DB_HOST'],
// 												process.env['DB_PORT'],
// 												process.env['DB_DEFAULT']);
//
// console.log(dbInfo);
// MongoDB 데이터베이스 접속하기
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/dolpic');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection error: '));
db.once('open', function callback () {
	console.log('Successfully connected to MongoDB');
});

// routes 설정
var admin = require('./routes/admin');
var apps = require('./routes/apps');
var index = require('./routes/index');
var users = require('./routes/users');
var pics = require('./routes/pics');
var api = require('./routes/api');

// 모바일 접속
var mPics = require('./routes/m/pics');
var mUsers = require('./routes/m/users');

var app = express();

app.locals.moment = require('moment');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(errorHandler);


// Express Session
app.use(session({
	secret: 'secret',
	saveUninitialized: true,
	resave: true
}));

// Passport
app.use(passport.initialize());
app.use(passport.session());

// Express Validator
app.use(expressValidator({
	errorFormatter: function(param, msg, value) {
		var namespace = param.split('.')
		, root    = namespace.shift()
		, formParam = root;

		while(namespace.length) {
			formParam += '[' + namespace.shift() + ']';
		}
		return {
			param : formParam,
			msg   : msg,
			value : value
		};
	}
}));

// Flash Messages
app.use(flash());
app.use(function (req, res, next) {
	res.locals.messages = require('express-messages')(req, res);
	next();
});

// 전처리 middleware
app.get('*', function(req, res, next) {
	res.locals.user = req.user || null;
	if (req.user) {
		res.locals.userType = req.user.userType;
	}

	//console.log(JSON.stringify(req.headers));
	// 모바일 접속 처리
	if (req.headers['user-agent'].indexOf('Mobile') > -1) {
		req.url = '/m' + req.url;
	}
	next();
});

// 어드민 페이지 middleware
app.get('/dolpic-admin/*', function(req, res, next) {
	if (!req.isAuthenticated() || res.locals.userType != 1) {
		req.flash('success','어드민으로 로그인 해주세요.');
		res.redirect('/users/login');
	} else {
		next();
	}
});

// routes path 설정
app.use('/', index);
app.use('/m', index);
app.use('/users', users);
app.use('/pics', pics);
app.use('/api', api);
app.use('/dolpic-admin', admin);
app.use('/m/app', apps);
app.use('/m/pics', mPics);
app.use('/m/users', mUsers);
	
// catch 404 and forward to error handler
app.use(function(req, res) {
	return res.render('errors/404');
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
	app.use(function(err, req, res, next) {
		res.status(err.status || 500);
		res.render('errors/error', {
			message: err.message,
			error: err
		});
	});
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
	res.status(err.status || 500);
	res.render('errors/error', {
		message: err.message,
		error: {}
	});
});


function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }
  res.status(500);
  res.render('errors/error', { error: err });
}


module.exports = app;