var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session'); // This is needed for sessions
var mongoose = require('mongoose');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var GitHubStrategy = require('passport-github').Strategy;
var flash = require('connect-flash');
var User = require('./models/user');

mongoose.connect(
  'mongodb+srv://test:test@comp2068-qabzd.mongodb.net/test?retryWrites=true&w=majority',
  { useNewUrlParser: true, useUnifiedTopology: true }
);

var db = mongoose.connection;
db.on('error', () => console.log('There was an error connecting'));
db.once('open', () => console.log('We have connected to Mongo Atlas'));

var indexRouter = require('./routes/index');
var authRouter = require('./routes/auth');
var articlesRouter = require('./routes/articles'); // This is our /Articles router

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// After our static folder, we will init our session
// But it needs to be before our other routes
app.use(
  session({
    secret: 'unicorn',
    resave: false,
    saveUninitialized: true
  })
);

app.use(flash());

// Init Passport for Authentication, this must be done after we use our session
app.use(passport.initialize());
app.use(passport.session());

const GITHUB_CLIENT_ID = '07946b49c79054f87212';
const GITHUB_CLIENT_SECRET = '9d568850dd5160541d1c075f9e132eea27795b3d';

passport.use(new LocalStrategy(User.authenticate()));
passport.use(
  new GitHubStrategy(
    {
      clientID: GITHUB_CLIENT_ID,
      clientSecret: GITHUB_CLIENT_SECRET,
      callbackURL: 'http://localhost:3000/callback/github'
    },
    function(accessToken, refreshToken, profile, cb) {
      User.findOne({ githubId: profile.id }, function(err, user) {
        if (!err && !user) {
          const newgithub = new User(profile);
          newgithub.save();
          return cb(null, newgithub);
        } else {
          return cb(err, user);
        }
      });
    }
  )
);
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.isLoggedIn = req.isAuthenticated();
  res.locals.user = req.user;

  if (req.isAuthenticated()) {
    res.locals.role = req.user.role;
  } else {
    res.locals.role = null;
  }

  next();
});

app.use('/', authRouter);
app.use('/', indexRouter);
app.use('/users', require('./routes/users'));
app.use('/articles', articlesRouter);

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
