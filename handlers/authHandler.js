const router = require('express').Router();
const passport = require('passport');
const LocalPassport = require('passport-local');
const crypto = require('../utils/crypto.js');

const User = require('../models/User');

const salt = "s3254jghdf3shajf543gkdgjh5432dkg4fa";

passport.use(new LocalPassport((username, password, done) => {
	User.findByUsername(username)
	.then(function(user) {
		if (!user) {
			return done(null, false);		
		}
		if (crypto.generateHashedPassword(salt, password.toString()) === user.password) {
			return done(null, user);
		}
	});
}));

passport.serializeUser((user, done) => {
	if (user) {
		return done(null, user.id);
	}
});

passport.deserializeUser((id, done) => {
	User.findById(id).then(function(user) {
		if(!user) {
			return done(null, false)
		}
		return done(null, user.username);
	});
});

router.get('/login', (req, res) => {
    const message = req.session.message;
    req.session.message = '';
    res.render('users/login', {
        message,
        inputData: req.session.inputData
    });
});

router.post('/login', passport.authenticate('local'), (req, res) => {
    req.session.message = {
			text: "Login successful",
			type: "success"
		};
    res.redirect('/');
});

router.get('/logout', (req, res) => {
	req.logout();
		req.session.destroy(function (err) {
		return res.redirect('/');
	 });
});

module.exports = router;