const express = require('express');
const router = express.Router();
const Article = require('../models/article');

router.get('/', async (req, res, next) => {
	// Returns all articles from the DB
	const articles = await Article.find({}).catch(() => {
		return [];
	});

	res.render('articles/archive.pug', { articles });
});

// Render the create form for an Article
router.get('/create', (req, res, next) => {
	res.render('articles/create', {});
});

router.post('/create', async (req, res, next) => {
	// Create a new article model
	const article = new Article(req.body);
	// Save model to DB
	await article.save();
	// Redirect back to list view
	res.redirect('/articles');
});



module.exports = router;