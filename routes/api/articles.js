const express = require('express')
// 导入jwt
const jwt = require('jsonwebtoken')
// 导入passport
const passport = require('passport')
// 引入formidable第三方模块
const formidable = require('formidable')
const path = require('path')

const {
    Article
} = require('../../models/article')

const articles = express.Router()

// post api/articles/add 添加文章接口
articles.post('/add', passport.authenticate('jwt', {
    session: false
}), async (req, res) => {
    // 1.创建表单解析对象
    const form = new formidable.IncomingForm()
    // 2.配置上传文件的路径
    form.uploadDir = path.join(__dirname, '../','../', '/public', '/uploads')
    // 3.保留上传文件的后缀
    form.keepExtensions = true
    // 4.解析表单
    form.parse(req, async (err, fields, files) => {
        // 1.err错误对象 如果表单解析失败，err里面存储错误信息 如果表单解析成功，err将会是null
        // 2.fields 对象类型 保存普通表单数据
        // 3.files 对象类型 保存了和文件相关的数据      
        await Article.create({
            title: fields.title,
            author: fields.author,
            category: fields.category,
            publishDate: fields.publishDate,
            cover: files.cover.path ? 'http://localhost:9090'+ files.cover.path.split('public')[1] : '' ,
            // cover: files.cover.path.split('public')[1],
            content: fields.content
        })
        res.json('发布成功')
    })
})

// get api/articles/    查询所有文章数据
articles.get('/',passport.authenticate('jwt', {
    session: false
}), async (req, res) => {
    try {
        // 接收客户端传递过来的当前页参数
        let page = req.query.page || 1
        // 每一页显示的数据条数
        let pagesize = req.query.pagesize
        // 总的文章数
        let total = await Article.countDocuments({})
        // 总页数
        let count = Math.ceil( total / pagesize)
        // 页码对应的数据查询开始位置
        let start = (page - 1) * pagesize
        // 将用户信息从数据库中查询出来
        const articles = await Article.find({}).populate('author').populate('category').sort({'_id':-1}).limit(Number(pagesize)).skip(Number(start))
        res.json({count,total,articles})
    } catch (e) {
        return res.status(404).json('没有任何数据')
    }
})

// get api/articles/article/:title 根据文章标题查询文章
articles.get('/article/:title', passport.authenticate('jwt', {
    session: false
}), async (req, res) => {   
        if (!req.params.title) {
            return res.status(400).json("文章标题不能为空");        
        }
        try {
            const reg = new RegExp(req.params.title)
            const articles = await Article.find({title: reg}).populate('author').populate('category')
        res.json({articles}) 
        } catch(e) {
            return res.status(404).json({message: '没有数据！'})
        }
})

// get api/articles/article/:id 根据文章id查询文章
articles.get('/:id', passport.authenticate('jwt', {
    session: false
}), async (req, res) => {   
        if (!req.params.id) {
            return res.status(400).json("文章标题不能为空");        
        }
        try {
            const articles = await Article.find({_id: req.params.id}).populate('author').populate('category')
        res.json({articles}) 
        } catch(e) {
            return res.status(404).json({message: '没有数据！'})
        }
})

// post api/articles/edit/:id
// 修改文章信息接口
articles.post('/edit/:id', passport.authenticate('jwt', {
    session: false
}), async (req, res) => {
    // 1.创建表单解析对象
    // console.log(req.body);
    const article = req.body.article
    const newArticle = await Article.findOneAndUpdate({_id: req.body.article._id}, {$set: article}, {new: true})
    res.json(newArticle)
})

// post api/articles/img 图片上传接口
articles.post('/img', passport.authenticate('jwt', {
    session: false
}), async (req, res) => {
    // 1.创建表单解析对象
    const form = new formidable.IncomingForm()
    // 2.配置上传文件的路径
    form.uploadDir = path.join(__dirname, '../','../', '/public', '/uploads')
    // 3.保留上传文件的后缀
    form.keepExtensions = true
    // 4.解析表单
    form.parse(req, async (err, fields, files) => {
        // 1.err错误对象 如果表单解析失败，err里面存储错误信息 如果表单解析成功，err将会是null
        // 2.fields 对象类型 保存普通表单数据
        // 3.files 对象类型 保存了和文件相关的数据
        const url = 'http://127.0.0.1:9090'+ files.img.path.split('public')[1]
        res.json({img: url})
    })
})

// delete api/articles/delete/:id
// 删除文章
articles.delete('/delete/:id', passport.authenticate('jwt', {
    session: false
}), async (req, res) => {
    try {
        const article = await Article.findOneAndRemove({_id: req.params.id})
        res.json(article)
    } catch (e) {
        return res.status(404).json('删除失败')
    }
})


module.exports = articles