var express = require('express');
var router = express.Router();

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var User = require('../models/User');

var DolPicImage = require('../models/DolPicImage');

var title = '돌픽 | 아이돌, 유명 연예인 SNS 이미지 모음';

// 바로가기에 보여줄 카운트
var gotoPageLimit = 5;

router.get('/main/:page?', function(req, res) {
	var page = req.params.page || 1;
	var pageLimitCount = 40;

	var query = {'isView': true};
	var options = {
		select  : 'url urlType likeCount hashTagId',
		sort    : {regDate: -1},
		populate: [{path: 'hashTagId', select: "twitterHashTag subscriberCount"}],
		lean    : true,
		page    : page,
		limit   : pageLimitCount
	};

	DolPicImage.getImagesByQueryAndOptions(query, options, function(error, result) {
		if (error) throw error;
		return res.render('apps/list',
			{
				title           : title,
				imageList       : result.docs,
				page            : result.page,
				limit           : result.limit,
				total           : result.total,
				pages           : result.pages,
				gotoPageLimit   : gotoPageLimit,
				pageUrl         : '/app/main/',
				commonJavascript: '/js/mobile/commonList.js',
				javascript      : '/js/mobile/dolpicList.js'
			}
		);
	});
});


router.get('/bookmarkList/:hashTag/:page?', function(req, res) {
	var hashTag = req.params.hashTag;
	var page = req.params.page || 1;
});


router.get('/favoriteBar/:hashTag', function(req, res) {
	var hashTag = req.params.hashTag;
});


router.get('/picView/:imageId/:hashTag/:page', function(req, res) {
	var hashTag = req.params.hashTag;
	var page = req.params.page || 1;
});


router.get('/bookmarkPicView/:imageId/:hashTag/:page', function(req, res) {
	var hashTag = req.params.hashTag;
	var page = req.params.page || 1;
});


router.get('/initialList', function(req, res) {
	var hashTag = req.params.hashTag;
	var page = req.params.page || 1;
});


router.post('/initialSearchList/:hashTag/', function(req, res) {
});


router.get('/hotDolPicList', function(req, res) {
});


router.get('/logIn', function(req, res) {
	return res.render('apps/logIn',
		{
		}
	);
});


router.post('/login', passport.authenticate('local', {
	failureRedirect: '/m/app/login',
	failureFlash   : true
}), function(req, res) {
	return res.redirect('/m/app/main');
});


router.post('/signUp', function(req, res) {
	var userId = req.body.UserId;
	var userPwd = req.body.UserPwd;

	return res.render('apps/logIn',
		{
		}
	);
});


router.get('/recommPicList/:imageId/:hashTag/:page', function(req, res) {
	var hashTag = req.params.hashTag;
	var page = req.params.page || 1;
});


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







module.exports = router;