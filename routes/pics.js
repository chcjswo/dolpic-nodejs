var express = require('express');
var router = express.Router();

var DolPicImage = require('../models/DolPicImage');

var title = '돌픽 | 아이돌, 유명 연예인 SNS 이미지 모음';

// 바로가기에 보여줄 카운트
var gotoPageLimit = 20;


router.get('/list/:hashTag/:hashTagId/:page?', function(req, res) {
	var hashTag = req.params.hashTag;
	var hashTagId = req.params.hashTagId;
	var page = req.params.page || 1;
	var pageLimitCount = 40;

	if (hashTagId === 'undefined') return;

	var query = {
		'hashTagId': hashTagId,
		'isView'   : true
	};
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
		return res.render('pics/dolpicList',
			{
				title           : title,
				hashTag         : hashTag,
				hashTagId       : hashTagId,
				imageList       : result.docs,
				page            : result.page,
				limit           : result.limit,
				total           : result.total,
				pages           : result.pages,
				gotoPageLimit   : gotoPageLimit,
				pageUrl         : '/pics/list/' + hashTag + '/' + hashTagId + '/',
				commonJavascript: '/js/web/commonList.js',
				javascript      : '/js/web/dolpicImageList.js'
			}
		);
	});
});


router.get('/list/:page?', function(req, res) {
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
		return res.render('pics/list',
			{
				title           : title,
				imageList       : result.docs,
				page            : result.page,
				limit           : result.limit,
				total           : result.total,
				pages           : result.pages,
				gotoPageLimit   : gotoPageLimit,
				pageUrl         : '/pics/list/',
				commonJavascript: '/js/web/commonList.js',
				javascript      : '/js/web/dolpicList.js'
			}
		);
	});
});


router.get('/view/:hashTag/:hashTagId/:imageId/:page', function(req, res) {
	var hashTag = req.params.hashTag;
	var hashTagId = req.params.hashTagId;
	var imageId = req.params.imageId;
	var page = req.params.page;

	DolPicImage.getImage({_id: imageId}, function(error, image) {
		if (error) throw error;
		res.render('pics/view',
			{
				title           : title,
				hashTag         : hashTag,
				hashTagId       : hashTagId,
				page            : page,
				imageId         : imageId,
				dolpicImage     : image,
				commonJavascript: '/js/web/commonView.js',
				javascript      : '/js/web/dolpicImageView.js'
			}
		);
	});
});


router.get('/newList/:page?', function(req, res) {
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
		return res.render('pics/newList',
			{
				title           : title,
				imageList       : result.docs,
				page            : result.page,
				limit           : result.limit,
				total           : result.total,
				pages           : result.pages,
				gotoPageLimit   : gotoPageLimit,
				pageUrl         : '/pics/newList/',
				commonJavascript: '/js/web/commonList.js',
				javascript      : '/js/web/dolpicImageList.js'
			}
		);
	});
});


module.exports = router;