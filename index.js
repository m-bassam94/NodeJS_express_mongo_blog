const express = require('express')
const app = express()
const Article = require('./model/article')
const articleRouter = require('./routes/article')
const mongoose = require('mongoose')
const methodOverride = require('method-override')
const createDomPurify = require('dompurify')
const { JSDOM } = require('jsdom')
const domPurify = createDomPurify(new JSDOM().window)


mongoose.connect('mongodb://localhost:27017/blog', { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }, (err) => {
    if (!err) return console.log('mongodb successfully connected');
    console.log(err);
})

app.listen(5000)

app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: false }))
app.use(methodOverride('_method'))



app.get('/', async (req, res) => {
    const articles = await Article.find().sort({ createdAt: 'desc' })
    res.render('index', { articles: articles })
})

app.use('/article', articleRouter)