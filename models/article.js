// 1.引入mongoose模块
const mongoose = require('mongoose')

// 2.创建文章集合
const articleScheme = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        maxlength: 20,
        minlength: 2
    },
    author: {
        type: mongoose.Schema.Types.ObjectId ,
        ref: 'User',
        required: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId ,
        ref: 'ArticleCategory',
        required: true
    },
    publishDate: {
        type: Date,
        default: Date.now
    },
    cover: {
        type: String,
        default: null
    },
    content: {
        type: String
    }
})

// 3.根据规则创建集合
const Article = mongoose.model('Article', articleScheme)

// 4.将集合规则作为模块成员导出
module.exports = { 
    Article
}