var express = require('express');
var router = express.Router();
var Article = require('../models/article');

/* GET home page. */
router.get('/', async function (req, res, next) {
	res.render('index', { title: 'Express' });
});

module.exports = router;
