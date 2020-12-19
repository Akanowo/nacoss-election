// jshint esversion:8
// Initialize variables
const http = require('http');
const express = require('express');
const mongoose = require('mongoose');
const debug = require('debug')('app:app.js');
const session = require('express-session');
const authRoutes = require('./routes/auth.route');
const voteRoutes = require('./routes/vote.route');
const adminRoutes = require('./routes/admin.route');
const passport = require('passport');
require('dotenv').config();

// Initialized express
const app = express();

const sess = {
	secret: 'LOL',
	resave: false,
	saveUninitialized: false,
	cookie: {}
};

if (app.get('env') === 'production') {
	app.set('trust proxy', 1); // trust first proxy
	sess.cookie.secure = true; // serve secure cookies
	mongoose.connect(process.env.MONGODBURI, { useFindAndModify: false, useNewUrlParser: true, useUnifiedTopology: true });
} else {
	mongoose.connect('mongodb://localhost:27017/nacossDB', { useFindAndModify: false, useNewUrlParser: true, useUnifiedTopology: true });
}

// App configuration
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(session(sess));
app.use(passport.initialize());
app.use(passport.session());
require('./controllers/passport')();
app.set('view engine', 'ejs');
app.use('/auth', authRoutes());
app.use('/vote', voteRoutes());
app.use('/admin', adminRoutes());



app.get('/', async (req, res) => {
	return res.redirect('/auth/login');
});


app.get('**', (req, res) => {
	return res.redirect('/');
});

const server = http.createServer(app);

server.listen(process.env.PORT || 8080, () => {
	debug('App started on port 8080');
});


