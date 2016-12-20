var express = require('express');
var router = express.Router();


/* GET home page. */
router.get('/', function(req, res) {
	if (req.isAuthenticated())
		return res.redirect('pics/newList');
	else
		return res.redirect('pics/list');
});


module.exports = router;