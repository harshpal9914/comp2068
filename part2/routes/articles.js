const express = require('express');
const router = express.Router();
const Article = require('../models/article');
const { requireAuth } = require('../middlewares/auth');

router.get('/', async (req, res, next) => {
  // Returns all articles from the DB
  const articles = await Article.find({}).catch(() => {
    return [];
  });

  res.render('articles/archive.pug', { articles });
});

router.use(requireAuth);

function findArticleByIdAndRenderPage(page, params) {
  return async (req, res, next) => {
    // 1. Get the ID form the URL
    const id = req.params.id;

    // 2. Find the article by it's ID
    const article = await Article.findById(id).catch(() => {
      return false;
    });

    // 3 If there's no article, redirect back to the articles page
    if (!article) return res.redirect('/articles');

    // 4. Render the edit page, and pass the found article
    res.render(page, { ...params, article });
  };
}

router.get('/delete/all', async (req, res, next) => {
  await Article.deleteMany({ title: 'Example 1' });

  res.redirect('/articles');
});

// Render the create form for an Article
router.get('/create', (req, res, next) => {
  res.render('articles/form', { title: 'Create an Article', article: {} });
});

router.post('/create', async (req, res, next) => {
  // Create a new article model
  const article = new Article(req.body);
  // Save model to DB
  await article.save();
  // Redirect back to list view
  res.redirect('/articles');
});

router.get('/:id', findArticleByIdAndRenderPage('articles/single'));

router.get(
  '/:id/edit',
  findArticleByIdAndRenderPage('articles/form', { title: 'Edit an temp' })
);

router.post('/:id/edit', async (req, res, next) => {
  // 1. Grab ID from the URL
  const id = req.params.id;

  // 2. Find the article
  // 3. Update the article
  await Article.findByIdAndUpdate(id, req.body);

  // 4. Redirect back to the article to see it updated
  res.redirect(`/articles/${id}`);
});
// This route will handle POST requests for
// /articles/1sdn2jfn3j3nje3j3nn3n/delete
router.post('/:id/delete', async (req, res, next) => {
  // 1. Get the ID from the url
  const id = req.params.id;

  // 2. Find the article by it's ID
  // 3. Delete the article
  await Article.findByIdAndDelete(id);

  // 4. Redirect back to the articles page
  res.redirect('/articles');
});

module.exports = router;
