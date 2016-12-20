var express = require('express');
var router = express.Router();

var DolPicImage = require('../models/DolPicImage');
var HashTag = require('../models/HashTag');
var User = require("../models/User");


router.post('/dolpicImages', function(req, res) {
	var hashTagId = req.body.hashTagId;
	var urlType = req.body.urlType;
	var url = req.body.imageUrl;

	// url Base64 Decode
	var buffer = new Buffer(url, 'base64');
	var toDecodeUrl = buffer.toString('ascii');

	var query = {
		hashTagId: hashTagId,
		urlType  : urlType,
		url      : toDecodeUrl
	};

	// 이미지가 있는지 조회
	DolPicImage.getImage(query, function(error, dolpicImage) {
		var resultJson = {};
		if (error) throw error;
		// 이미지가 없으면 입력
		if (!dolpicImage) {
			var newwDolpicImage = DolPicImage(query);

			DolPicImage.addImage(newwDolpicImage, function(error, result) {
				if (error) {
					console.log(error);
					resultJson = {
						message: "등록에 실패 했습니다.",
						code   : error.code
					};
				} else {
					resultJson = {
						message: "등록에 성공 했습니다.",
						code   : 0
					};
				}
				// hashTag image update
				HashTag.updateHashTag(hashTagId, {image: toDecodeUrl}, function(error, hashTag) {
					if (error) console.log(error);
				});
				return res.json(resultJson);
			});
		} else {
			resultJson = {
				message: "이미 등록된 이미지 입니다.",
				code   : 11000
			};
			return res.json(resultJson);
		}
	});
});


router.post('/initials', function(req, res) {
	HashTag.getHashTags({}, 1, 1000, function(error, result) {
		if (error) throw error;
		var userId = '';
		if (req.isAuthenticated()) userId = req.user._id;
		return res.json({'result': result.docs, 'userId': userId});
	});
});


router.post('/hotdolpics', function(req, res) {
	HashTag.getHotDolPics(function(error, hashTag) {
		if (error) throw error;
		return res.json(hashTag);
	});
});

router.post('/addSubscribe', function(req, res) {
	var hashTagId = req.body.hashTagId;
	req.checkBody('hashTagId', '잘 못된 접근입니다.').notEmpty();
	errors = req.validationErrors();

	if (errors) {
		return res.json({message: errors.msg});
	}
	if (!req.isAuthenticated()) {
		return res.json({message: "로그인후 사용 가능합니다."});
	}
	var query = {
		$and: [
			{_id: req.user._id},
			{subscribeHashTag: {$elemMatch: {hashTagId: hashTagId}}}
		]
	};

	User.checkSubscibe(query, function(error, resultUser) {
		if (error) throw error;
		if (resultUser) {
			return res.json({message: '이미 등록 하셨습니다.', code: 1});
		} else {
			User.addSubscibe({'userId': req.user._id, 'hashTagId': hashTagId}, function(error, user) {
				if (error) throw error;
			});
			HashTag.updateSubscibeCount({'userId': req.user._id, 'hashTagId': hashTagId}, function(error, hashTag) {
				if (error) throw error;
			});
			return res.json({message: '등록 했습니다.', code: 0});
		}
	});
});


router.post('/mypage', function(req, res) {
	if (!req.isAuthenticated()) {
		return res.redirect('/users/login');
	}
	var hashTag = req.body.hashTag;
	var query = {};

	if (hashTag) {
		query = {
			$and: [
				{twitterHashTag: req.body.hashTag},
				{subscriber: {$elemMatch: {userId: req.user._id}}}
			]
		};
	} else {
		query = {
			subscriber: {$elemMatch: {userId: req.user._id}}
		};
	}

	HashTag.getMyHashTags(query, 1, 1000, function(error, result) {
		if (error) throw error;
		return res.json(result.docs);
	});
});


router.delete('/mypage', function(req, res) {
	if (!req.isAuthenticated()) {
		return res.redirect('/users/login');
	}
	var data = {
		userId   : req.user._id,
		hashTagId: req.body.hashTagId
	}
	HashTag.deleteMyHashTag(data, function(error, result) {
		if (error) throw error;
	});
	User.deleteSubscibe(data, function(error, result) {
		if (error) throw error;
	});

	return res.json({message: '삭제 했습니다.', code: 0});
});


router.post('/addImageLike', function(req, res) {
	if (!req.isAuthenticated()) {
		return res.json({message: '로그인을 해야 가능 합니다.', code: 1});
	}
	var data = {
		userId   : req.user._id,
		hashTag  : req.body.hashTag,
		hashTagId: req.body.hashTagId,
		imageId  : req.body.imageId
	};

	DolPicImage.addImageLike(data, function(error, result) {
		if (error) throw error;
	});
	HashTag.addImageLike(data, function(error, result) {
		if (error) throw error;
	});

	return res.json({message: '좋아요.', code: 0});
});


router.post('/recommendImages', function(req, res) {
	var hashTagId = req.body.hashTagId;
	var query = {
		'hashTagId': hashTagId,
		'isView'   : true
	};
	var options = {
		select  : 'url urlType likeCount hashTagId',
		sort    : {likeCount: -1, regDate: -1},
		populate: [{path: 'hashTagId', select: "twitterHashTag subscriberCount"}],
		lean    : true,
		limit   : 5
	};
	DolPicImage.getImagesByQueryAndOptions(query, options, function(error, result) {
		if (error) throw error;
		return res.json(result.docs);
	});
});


router.post('/getImagePrev', function(req, res) {
	var query = {
		'hashTagId': req.body.hashTagId,
		'_id'      : {'$gt': req.body.imageId}
	};

	DolPicImage.getPrevImage(query, function(error, result) {
		if (error) throw error;
		var prev = 'null';
		if (result != null) {
			prev = result._id;
		}
		return res.json({'prev': prev});
	});
});


router.post('/getImageNext', function(req, res) {
	var query = {
		'hashTagId': req.body.hashTagId,
		'_id'      : {'$lt': req.body.imageId}
	};

	DolPicImage.getNextImage(query, function(error, result) {
		if (error) throw error;
		var next = 'null';
		if (result != null) {
			next = result._id;
		}
		return res.json({'next': next});
	});

	// var getUserName = function( callback ) {
	//  // get the username somehow
	//  var username = "Foo";
	//  callback( username );
	// };
	// var saveUserInDatabase = function( username ) {
	// 	console.log("User: " + username + " is saved successfully.")
	// };
	// getUserName( saveUserInDatabase );
});

var randomIndex = 140;

router.post('/list', function(req, res) {
	HashTag.getHashTagId(random(1, randomIndex), function(error, data) {
		if (error) throw error;
		var hashTagId;
		if (data) {
			hashTagId = data._id;
		}
		var query = {
			'hashTagId': hashTagId,
			'isView'   : true
		};
		DolPicImage.getMainList(query, random(1, randomIndex), 5, function(error, result) {
			if (error) throw error;
			return res.json(result);
		});
	});
});


router.post('/listNew', function(req, res) {
	DolPicImage.getMainList({}, random(1, randomIndex), 10, function(error, result) {
		if (error) throw error;
		return res.json(result);
	});
});


router.post('/imageReport', function(req, res) {
	if (!req.isAuthenticated()) {
		return res.json({message: '로그인을 해야 가능 합니다.', code: 1});
	}
	var data = {
		userId   : req.user._id,
		hashTag  : req.body.hashTag,
		hashTagId: req.body.hashTagId,
		imageId  : req.body.imageId
	};
	var query = {
		$and: [
			{_id: req.body.imageId},
			{imageReport: {$elemMatch: {userId: req.user._id}}}
		]
	};

	DolPicImage.checkReport(query, function(error, result) {
		if (error) throw error;
		if (result) {
			return res.json({'message': '이미 신고 하셨습니다.'});
		} else {
			DolPicImage.addImageReport(data, function(error, result) {
				if (error) throw error;
				return res.json({'message': '정상적으로 신고를 했습니다.'});
			});
		}
	});
});


function random(low, high) {
	return Math.random() * (high - low) + low;
}


module.exports = router;