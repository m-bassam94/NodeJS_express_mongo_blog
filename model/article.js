const mongoose = require('mongoose')
const slugify = require('slugify')
const createDomPurify = require('dompurify')
const { JSDOM } = require('jsdom')
const domPurify = createDomPurify(new JSDOM().window)
const marked = require('marked')

const articleSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    markDown: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    slug: {
        type: String,
        strict: true,
        unique: true
    },
    sanitizedHtml: {
        type: String,
        required: true
    }
})

articleSchema.pre('validate', function (next) {
    if (this.title) {
        this.slug = slugify(this.title, { lower: true, strict: true })
    }

    if (this.markDown) {
        this.sanitizedHtml = domPurify.sanitize(marked(this.markDown))
    }

    next()
})

module.exports = mongoose.model('Article', articleSchema)