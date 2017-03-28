const express = require('express');
const router = express.Router();

const DolPicImage = require('../../models/DolPicImage');
const HashTag = require('../../models/HashTag');

const title = '돌픽 | 아이돌, 유명 연예인 SNS 이미지 모음';

// 바로가기에 보여줄 카운트
const gotoPageLimit = 5;


router.get('/list/:hashTag/:hashTagId/:page?', function(req, res) {
	const hashTag = req.params.hashTag;
	const hashTagId = req.params.hashTagId;
	const page = req.params.page || 1;
	const pageLimitCount = 40;

	if (hashTagId === 'undefined') return;

	const query = {
		'hashTagId': hashTagId,
		'isView'   : true
	};
	const options = {
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
	const page = req.params.page || 1;
	const pageLimitCount = 40;

	const query = {'isView': true};
	const options = {
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
	const hashTag = req.params.hashTag;
	const pageLimitCount = 40;
	let query = {'twitterHashTag': hashTag};

	HashTag.getHashTagIdByHasTag(query, function(error, result) {
		if (error) throw error;

		let hashTagId = '582aa8912b1eb829e9d293d1';
		if (result)
			hashTagId = result._id;

		query = {'hashTagId': hashTagId, 'isView': true};
		const options = {
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
	const hashTag = req.params.hashTag;
	const hashTagId = req.params.hashTagId;
	const imageId = req.params.imageId;
	const page = req.params.page;

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
	const page = req.params.page || 1;
	const pageLimitCount = 40;

	const query = {'isView': true};
	const options = {
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