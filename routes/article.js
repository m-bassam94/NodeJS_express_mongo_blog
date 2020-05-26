const express = require('express')
const router = express.Router()
const Article = require('./../model/article')

router.get('/new', (req, res) => {
    res.render('./articles/new', { article: new Article })
})

router.get('/:slug', async (req, res) => {
    const article_to_show = await Article.findOne({ slug: req.params.slug })
    if (article_to_show == null) { res.redirect('/') }
    res.render('./articles/show', { article: article_to_show })
})

router.delete('/:id', async (req, res) => {
    await Article.findByIdAndDelete(req.params.id)
    res.redirect('/')
})

router.get('/edit/:id', async (req, res) => {
    const article = await Article.findById(req.params.id)
    res.render('./articles/edit', { article: article })
})

router.put('/edit/:id', async (req, res, next) => {
    req.article = await Article.findById(req.params.id)
    next()
}, saveArticleAndRedirect('edit'))

router.post('/new', async (req, res, next) => {
    req.article = new Article()
    next()
}, saveArticleAndRedirect('new'))

function saveArticleAndRedirect(path) {
    return async (req, res) => {
        let article = req.article
        article.title = req.body.title
        article.description = req.body.description
        article.markDown = req.body.markDown

        console.log(article);


        try {
            article = await article.save()
            res.redirect(`/article/${article.slug}`)
        } catch (error) {
            // console.log(error);
            res.render(`./articles/${path}`, { article: article })
        }
    }
}

module.exports = router