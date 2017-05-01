const express = require('express');
const router = express.Router();
const fs = require('fs');

const User = require('../models/User');
const HashTag = require('../models/HashTag');
const Image = require('../models/DolPicImage');

const title = '돌픽 - 어드민';
// 한페이지에 보여줄 ROW 카운트
const pageLimitCount = 2000;
// 바로가기에 보여줄 카운트
const gotoPageLimit = 20;


// 어드민 메뉴 리스트
router.get('/admin-index', function(req, res) {
	return res.render('admin/index',
		{
			title   : title,
			subTitle: '돌픽 어드민',
			menu    : {
				menu1: "inactive",
				menu2: "inactive"
			}
		}
	);
});


// 해쉬태그 리스트
router.get('/hashTagList/:page?', function(req, res) {
	const page = req.params.page || 1;
	let query = '{}';

	HashTag.getHashTags(query, page, pageLimitCount, function(error, result) {
		if (error) throw error;

		return res.render('admin/hashTagList',
			{
				title        : title,
				subTitle     : '해쉬태그 리스트',
				hashTags     : result.docs,
				page         : result.page,
				limit        : result.limit,
				total        : result.total,
				pages        : result.pages,
				gotoPageLimit: gotoPageLimit,
				javascript   : '/js/admin/hashTagList.js',
				pageUrl      : '/dolpic-admin/hashTagList/',
				menu         : {
					menu1: "active",
					menu2: "inactive"
				}
			}
		);
	});
});


// 해당 해쉬태그 이미지 리스트
router.get('/imageList/:hashTagId/:page', function(req, res) {
	const page = req.params.page || 1;
	const hashTagId = req.params.hashTagId;
	const query = {
		hashTagId: hashTagId
	};

	Image.getImages(query, page, pageLimitCount, function(error, result) {
		if (error) throw error;
		return res.render('admin/imageList',
			{
				title        : title,
				subTitle     : hashTagId + ' 이미지 리스트',
				images       : result.docs,
				page         : result.page,
				limit        : result.limit,
				total        : result.total,
				pages        : result.pages,
				gotoPageLimit: gotoPageLimit,
				javascript   : '/js/admin/imageList.js',
				pageUrl      : '/dolpic-admin/imageList/' + hashTagId + '/',
				menu         : {
					menu1: "active",
					menu2: "inactive"
				}
			}
		);
	});
});


// 이미지 삭제
router.delete('/image', function(req, res) {
	const imageId = req.body.imageId;
	let resultJson = {};
	Image.deleteImage({_id: imageId}, function(error, image) {
		if (error) {
			resultJson = {
				message: "삭제에 실패 했습니다.",
				code   : 99
			};
		} else {
			resultJson = {
				message: "삭제에 성공 했습니다.",
				code   : 0
			};
		}
		return res.json(resultJson);
	})
});


// 해쉬태그 만들기 폼
router.get('/hashTagMake', function(req, res) {
	return res.render('admin/hashTagMakeForm',
		{
			title     : title,
			subTitle  : '해쉬태그 만들기 폼',
			javascript: '/js/admin/hashTagMake.js'
		}
	);
});


// 해쉬태그 만들기
router.post('/hashTagMake', function(req, res) {
	const hashTag = HashTag({
		initial         : req.body.initial,
		twitterHashTag  : req.body.twitterHashTag,
		instagramHashTag: req.body.instaHashTag
	});

	HashTag.addHashTag(hashTag, function(error, HashTag) {
		let resultJson = {};
		if (error) {
			// 중복 코드
			if (error.code === 11000) {
				resultJson = {
					message: "이미 등록된 해쉬코드 입니다.",
					code   : error.code
				};
			} else {
				resultJson = {
					message: "등록에 실패 했습니다.",
					code   : error.code
				};
			}
		} else {
			resultJson = {
				message: "등록에 성공 했습니다.",
				code   : 0
			};
		}
		return res.json(resultJson);
	});
});


// 해쉬태그 수정 폼
router.get('/hashTagUpdate/:hashTagId', function(req, res) {
	const hashTagId = req.params.hashTagId;

	HashTag.getHashTagById(hashTagId, function(error, hashTag) {
		return res.render('admin/hashTagUpdateForm',
			{
				title     : title,
				subTitle  : '해쉬태그 수정 폼',
				hashTag   : hashTag,
				javascript: '/js/admin/hashTagUpdate.js'
			}
		);
	});
});


// 해쉬태그 수정 하기
router.put('/hashTagUpdate', function(req, res) {
	const hashTagId = req.body.hashTagSeq;
	const hashTag = {
		initial         : req.body.initial,
		twitterHashTag  : req.body.twitterHashTag,
		instagramHashTag: req.body.instaHashTag
	};

	HashTag.updateHashTag(hashTagId, hashTag, function(error, hashTag) {
		let resultJson = {};
		if (error) {
			// 중복 코드
			if (error.code === 11000) {
				resultJson = {
					message: "이미 등록된 해쉬코드 입니다.",
					code   : error.code
				};
			} else {
				resultJson = {
					message: "수정에 실패 했습니다.",
					code   : error.code
				};
			}
		} else {
			resultJson = {
				message: "수정에 성공 했습니다.",
				code   : 0
			};
		}
		return res.json(resultJson);
	});
});


// 해쉬태그 삭제 하기
router.delete('/hashTagDelete', function(req, res) {
	const hashTagId = req.body.hashTagSeq;
	let resultJson = {};

	HashTag.deleteHashTag(hashTagId, function(error, hashTag) {
		if (error) {
			resultJson = {
				message: "삭제에 실패 했습니다.",
				code   : 99
			};
		} else {
			// 이미지 삭제
			Image.deleteImage({'hashTagId': hashTagId}, function(error, image) {
				if (error) {
					resultJson = {
						message: "삭제에 실패 했습니다.",
						code   : 99
					};
				} else {
					resultJson = {
						message: "삭제에 성공 했습니다.",
						code   : 0
					};
				}
			});
			resultJson = {
				message: "삭제에 성공 했습니다.",
				code   : 0
			};
		}
		return res.json(resultJson);
	});
});


// JSON 만들기
router.post('/makeHashTagToJson', function(req, res) {
	let resultJson = {};

	HashTag.getAllHashTags(function(error, hashTag) {
		if (error) throw error;

		fs.writeFile('./public/json/dolpic.json', JSON.stringify(hashTag), 'utf8', function(err) {
			if (err) {
				resultJson = {
					message: "json파일 만들기에 실패 했습니다."
				};
			} else {
				resultJson = {
					message: "json파일을 만들었습니다."
				};
			}
			return res.json(resultJson);
		});
	});
});


// 유저 리스트 조회
router.get('/usersList/:page?', function(req, res) {
	const page = req.params.page || 1;
	let query = '{}';

	User.getUsers(query, page, pageLimitCount, function(error, result) {
		if (error) throw error;

		return res.render('admin/usersList',
			{
				title        : title,
				subTitle     : '유저 리스트',
				users        : result.docs,
				page         : result.page,
				limit        : result.limit,
				total        : result.total,
				pages        : result.pages,
				gotoPageLimit: gotoPageLimit,
				javascript   : '/js/admin/userList.js',
				pageUrl      : '/dolpic-admin/usersList/',
				menu         : {
					menu1: "inactive",
					menu2: "active"
				}
			}
		);
	});
});


// 회원 즐겨찾기 목록 조회
router.get('/userFavoriteList/:page/:username', function(req, res) {
	const page = req.params.page;
	const username = req.params.username;

	User.getFavoriteHashTag(username, function(error, users) {
		if (error) throw error;
		return res.render('admin/userFavoriteList',
			{
				title   : title,
				subTitle: username + ' 즐겨찾기 리스트',
				page    : page,
				users   : users,
				menu    : {
					menu1: "inactive",
					menu2: "active"
				}
			}
		);
	});
});


// 회원 삭제
router.delete('/user', function(req, res) {
	const username = req.body.username;
	let resultJson = {};
	User.deleteUser(username, function(error, user) {
		if (error) {
			resultJson = {
				message: "삭제에 실패 했습니다.",
				code   : 99
			};
		} else {
			resultJson = {
				message: "삭제에 성공 했습니다.",
				code   : 0
			};
		}
		return res.json(resultJson);
	})
});


module.exports = router;
