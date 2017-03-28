const express = require('express');
const router = express.Router();

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const User = require('../models/User');

const title = '돌픽 | 아이돌, 유명 연예인 SNS 이미지 모음';


passport.serializeUser(function(user, done) {
	done(null, user._id);
});


passport.deserializeUser(function(id, done) {
	User.getUserById(id, function(err, user) {
		done(err, user);
	});
});


passport.use(new LocalStrategy(
	function(username, password, done) {
		User.getUserByQuery({'username': username}, function(error, user) {
			if (error) throw error;
			if (!user) {
				return done(null, false, {message: username + ' 에 해당하는 유저 정보를 찾을 수 없습니다.'});
			}

			User.comparePassword(password, user.password, function(error, isMatch) {
				if (error) return done(error);
				if (isMatch) {
					return done(null, user);
				} else {
					return done(null, false, {message: '비밀번호가 올바르지 않습니다.'});
				}
			});
		});
	}
));


router.get('/login', function(req, res) {
	var returnUrl = req.query.returnUrl;
	return res.render('users/login',
		{
			title     : title,
			returnUrl	: returnUrl,
			javascript: '/js/common/login.js'
		}
	);
});


// router.post('/login', passport.authenticate('local', {
// 	failureRedirect: '/users/login',
// 	failureFlash   : true
// }), function(req, res) {
// 	var returnUrl = req.body.returnUrl;
// 	return res.redirect(returnUrl == '' ? '/' : encodeURI(returnUrl));
// });


router.post('/login', function(req, res, next) {
    passport.authenticate('local', function(err, user, info) {
        if ( err ) {
            next(err);
            return
        }
				const returnUrl = encodeURI(req.body.returnUrl);
        // User does not exist
        if ( ! user ) {
            req.flash('error', info.message);
            return res.redirect('/users/login?returnUrl=' + returnUrl);
        }
        req.logIn(user, function(err) {
            // Invalid password
            if ( err ) {
                req.flash('error', info.message);
                next(err);
                return
            }
            return res.redirect(returnUrl === '' ? '/' : returnUrl);
        });
    })(req, res, next);
});

router.get('/signup', function(req, res) {
	return res.render('users/signup',
		{
			title     : title,
			javascript: '/js/common/signup.js'
		}
	);
});


router.post('/signup', function(req, res) {
	const username = req.body.username;
	const password = req.body.password;
	const password2 = req.body.password2;

	req.checkBody('username', '아이디가 입력되지 않았습니다.').notEmpty();
	req.checkBody('password', '비밀번호가 입력되지 않았습니다.').notEmpty();
	req.checkBody('password2', '입력한 비밀번호가 일치하지 않습니다.').equals(password);

	errors = req.validationErrors();

	if (errors) {
		req.flash('fail', errors.msg);
		return res.render('users/signup',
			{
				title     : title,
				errors    : errors,
				username  : username,
				javascript: '/js/common/signup.js'
			}
		);
	}

	const newUser = new User({
		username: username,
		password: password
	});

	User.addUser(newUser, function(error, user) {
		let message;

		if (error) {
			// 중복 유저
			if (error.code === 11000) {
				message = '이미 등록된 아이디 입니다.';
			} else {
				message = '등록에 실패 했습니다.';
			}
			req.flash('fail', message);
			return res.render('users/signup',
				{
					title     : title,
					errors    : errors,
					username  : username,
					javascript: '/js/common/signup.js'
				}
			);
		}
		return res.redirect('/users/login');
	});
});


router.get('/logout', function(req, res) {
	req.logout();
	return res.redirect('/');
});


router.get('/mypage', function(req, res) {
	if (!req.isAuthenticated()) {
		return res.redirect('/users/login');
	}
	return res.render('users/mypage',
		{
			title           : title,
			commonJavascript: '/js/web/commonList.js',
			javascript      : '/js/common/mypage.js'
		}
	);
});


module.exports = router;