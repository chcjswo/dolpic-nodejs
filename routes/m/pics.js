var express = require('express');
var router = express.Router();

var DolPicImage = require('../../models/DolPicImage');
var HashTag = require('../../models/HashTag');

var title = '돌픽 | 아이돌, 유명 연예인 SNS 이미지 모음';

// 바로가기에 보여줄 카운트
var gotoPageLimit = 5;


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
		return res.render('m/pics/dolpicList',
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
				commonJavascript: '/js/mobile/commonList.js',
				javascript      : '/js/mobile/dolpicImageList.js'
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
		return res.render('m/pics/list',
			{
				title           : title,
				imageList       : result.docs,
				page            : result.page,
				limit           : result.limit,
				total           : result.total,
				pages           : result.pages,
				gotoPageLimit   : gotoPageLimit,
				pageUrl         : '/pics/list/',
				commonJavascript: '/js/mobile/commonList.js',
				javascript      : '/js/mobile/dolpicList.js'
			}
		);
	});
});


router.get('/search/:hashTag', function(req, res) {
	var hashTag = req.params.hashTag;
	var pageLimitCount = 40;
	var query = {'twitterHashTag': hashTag};

	HashTag.getHashTagIdByHasTag(query, function(error, result) {
		if (error) throw error;

		var hashTagId = '582aa8912b1eb829e9d293d1';
		if (result)
			hashTagId = result._id;

		query = {'hashTagId': hashTagId, 'isView': true};
		var options = {
			select  : 'url urlType likeCount hashTagId',
			sort    : {regDate: -1},
			populate: [{path: 'hashTagId', select: "twitterHashTag subscriberCount"}],
			lean    : true,
			page    : 1,
			limit   : pageLimitCount
		};

		DolPicImage.getImagesByQueryAndOptions(query, options, function(error, result) {
			if (error) throw error;
			return res.render('m/pics/dolpicList',
				{
					title           : title,
					hashTag         : hashTag,
					imageList       : result.docs,
					page            : result.page,
					limit           : result.limit,
					total           : result.total,
					pages           : result.pages,
					gotoPageLimit   : gotoPageLimit,
					pageUrl         : '/pics/list/',
					commonJavascript: '/js/mobile/commonList.js',
					javascript      : '/js/mobile/dolpicImageList.js'
				}
			);
		});
	});
});


router.get('/view/:hashTag/:hashTagId/:imageId/:page', function(req, res) {
	var hashTag = req.params.hashTag;
	var hashTagId = req.params.hashTagId;
	var imageId = req.params.imageId;
	var page = req.params.page;

	DolPicImage.getImage({_id: imageId}, function(error, image) {
		if (error) throw error;
		res.render('m/pics/view',
			{
				title           : title,
				hashTag         : hashTag,
				hashTagId       : hashTagId,
				page            : page,
				imageId         : imageId,
				dolpicImage     : image,
				commonJavascript: '/js/mobile/commonView.js',
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
		populate: [{path: 'hashTagId', select: "twitterHashTag instagramHashTag subscriberCount"}],
		lean    : true,
		page    : page,
		limit   : pageLimitCount
	};

	DolPicImage.getImagesByQueryAndOptions(query, options, function(error, result) {
		if (error) throw error;
		return res.render('m/pics/newList',
			{
				title           : title,
				imageList       : result.docs,
				page            : result.page,
				limit           : result.limit,
				total           : result.total,
				pages           : result.pages,
				gotoPageLimit   : gotoPageLimit,
				pageUrl         : '/pics/newList/',
				commonJavascript: '/js/mobile/commonList.js',
				javascript      : '/js/mobile/dolpicList.js'
			}
		);
	});
});


module.exports = router;