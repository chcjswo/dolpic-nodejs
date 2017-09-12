const express = require('express');
const router = express.Router();
const fs = require('fs');
const Slack = require('slack-node');

const DolPicImage = require('../models/DolPicImage');
const HashTag = require('../models/HashTag');
const User = require("../models/User");

const webhookUri = "https://hooks.slack.com/services/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";
const loginMessage = "로그인 후 이용가능합니다.";

router.post('/dolpicImages', function(req, res) {
	const hashTagId = req.body.hashTagId;
	const urlType = req.body.urlType;
	const url = req.body.imageUrl;
	const caption = req.body.caption;

	// url Base64 Decode
	const buffer = new Buffer(url, 'base64');
	const toDecodeUrl = buffer.toString('ascii');

	const query = {
		hashTagId: hashTagId,
		urlType  : urlType,
		url      : toDecodeUrl,
		caption  : caption // caption은 base64디코딩 하지 않고 그냥 입력
	};

	// 이미지가 있는지 조회
	DolPicImage.getImage(query, function(error, dolpicImage) {
		let resultJson = {};
		if (error) throw error;
		// 이미지가 없으면 입력
		if (!dolpicImage) {
			const newwDolpicImage = DolPicImage(query);

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
		let userId = '';
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
	const hashTagId = req.body.hashTagId;
	req.checkBody('hashTagId', '잘 못된 접근입니다.').notEmpty();
	errors = req.validationErrors();

	if (errors) {
		return res.json({message: errors.msg});
	}
	if (!req.isAuthenticated()) {
		return res.json({message: loginMessage});
	}
	const query = {
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
	const hashTag = req.body.hashTag;
	let query = {};

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
	const data = {
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
		return res.json({message: loginMessage, code: 1});
	}
	const data = {
		userId   : req.user._id,
		hashTag  : req.body.hashTag,
		hashTagId: req.body.hashTagId,
		imageId  : req.body.imageId
	};

	const query = {
		$and: [
			{_id: req.body.imageId},
			{imageLike: {$elemMatch: {userId: req.user._id}}}
		]
	};

	DolPicImage.checkImageLike(query, function(error, checkResult) {
		if (error) throw error;
		if (checkResult) {
			return res.json({message: '이미 좋아요를 하셨습니다.', code: 9});
		} else {

			DolPicImage.addImageLike(data, function(error, result) {
				if (error) throw error;
				console.log(result);
			});
			HashTag.addImageLike(data, function(error, result) {
				if (error) throw error;
				console.log(result);
			});

			return res.json({message: '좋아요.', code: 0});
		}
	});
});


router.post('/recommendImages', function(req, res) {
	const hashTagId = req.body.hashTagId;
	const query = {
		'hashTagId': hashTagId,
		'isView'   : true
	};
	const options = {
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
	const query = {
		'hashTagId': req.body.hashTagId,
		'_id'      : {'$gt': req.body.imageId}
	};

	DolPicImage.getPrevImage(query, function(error, result) {
		if (error) throw error;
		let prev = 'null';
		if (result !== null) {
			prev = result._id;
		}
		return res.json({'prev': prev});
	});
});


router.post('/getImageNext', function(req, res) {
	const query = {
		'hashTagId': req.body.hashTagId,
		'_id'      : {'$lt': req.body.imageId}
	};

	DolPicImage.getNextImage(query, function(error, result) {
		if (error) throw error;
		let next = 'null';
		if (result !== null) {
			next = result._id;
		}
		return res.json({'next': next});
	});
});

const randomIndex = 140;

router.post('/list', function(req, res) {
	HashTag.getHashTagId(random(1, randomIndex), function(error, data) {
		if (error) throw error;
		let hashTagId;
		if (data) {
			hashTagId = data._id;
		}
		const query = {
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
		return res.json({message: loginMessage, code: 1});
	}
	const data = {
		userId   : req.user._id,
		hashTag  : req.body.hashTag,
		hashTagId: req.body.hashTagId,
		imageId  : req.body.imageId
	};
	const query = {
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


router.post('/jsonToMongodb', function(req, res) {
	const text = fs.readFileSync('./public/json/dolpic.json', 'utf8');
	const jsonData = JSON.parse(text);

	for (let i=0; i<jsonData.length; i++) {
		let hashTag = HashTag({
			twitterHashTag   	: jsonData[i].twitterHashTag,
			instagramHashTag  : jsonData[i].instagramHashTag
		});

		HashTag.addHashTag(hashTag, function(error, result) {
		});
	}

	return res.json(text);
});


/* 모든 해쉬태그들 조회 */
router.post('/allHashTags', function(req, res) {
	HashTag.getAllHashTags(function(error, hashTag) {
		if (error) throw error;
		return res.json(hashTag);
	});
});


/**
 * @function 이미지 업로드후 슬랙 메시지 보내기
 */
router.post('/slack-notify', (req, res) => {
	const time = req.body.time;
	const slack = new Slack();
	slack.setWebhook(webhookUri);

	slack.webhook({
		channel : '#build',
		username: 'dolpic-crawler',
		text    : '이미지 크롤링 완료!! 총 ' + time + '초 걸림 고생 많이 했음~~'
	}, function(err, response) {
	  console.log(response);
	  return res.json(
	  	{status: response.status}
	  );
	});
});


function random(low, high) {
	return Math.random() * (high - low) + low;
}


module.exports = router;