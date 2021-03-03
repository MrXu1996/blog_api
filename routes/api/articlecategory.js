const express = require('express');
// 导入jwt
const jwt = require('jsonwebtoken')
// 导入passport
const passport = require('passport')

// 导入文章分类集合构造函数
const {
    ArticleCategory
} = require('../../models/articlecategory');
const articles = require('./articles');

const articlecategory = express.Router();

// 添加文章分类
// post api/articlecategory/add
articlecategory.post('/add', passport.authenticate('jwt', {
    session: false
}), async (req, res) => {
    // 接收请求参数
    const {
        name
    } = req.body.category;
    if (name) {
        let data = await ArticleCategory.findOne({
            name
        })
        // 将客户端传递过来的邮箱和数据库中的邮箱进行对比
        if (data) {
            // 将客户端传递过来的邮箱和数据库中的邮箱进行对比
            return res.status(400).json({
                msg: '该分类已存在！'
            })
        } else {
            const newCategory = new ArticleCategory({
                name
            })
            newCategory.save()
                .then(data => res.json(data))
                .catch(err => console.log(err));
        }
    }
})

// 查询文章分类
// get api/articlecategory/
articlecategory.get('/', passport.authenticate('jwt', {
    session: false
}), async (req, res) => {
    const names = await ArticleCategory.find({})
    if (names) {
        return res.status(200).json({
            names
        })
    }
    return res.status(400).json('获取文章分类信息失败')
})

// get api/articlecategory/:name
// 查询单个分类信息
articlecategory.get('/:name', passport.authenticate('jwt', {
    session: false
}), async (req, res) => {
        if (!req.params.name) {
            return res.status(400).json("分类名不能为空");        
        }
        try {
            const reg = new RegExp(req.params.name)
            const category = await ArticleCategory.find({name: reg}) 
            res.json({category}) 
        } catch(e) {
            return res.status(404).json({message: '没有数据！'})
        }
})


// 修改文章分类
// post api/articlecategory/edit/:id
articlecategory.post('/edit/:id', passport.authenticate('jwt', {
    session: false
}), async (req, res) => {
    const category = {}
    // 判断客户端发送过来的数据是否为空
    const data = req.body.category
    if (data) {
        category.name = data.name
        const newCategory = await ArticleCategory.findOneAndUpdate({
            _id: req.params.id
        }, {
            $set: category
        }, {
            new: true
        })
        return res.status(200).json('修改文章分类成功')

    } else {
        return res.status(400).json({
            msg: '修改文章分类失败'
        })
    }
})

// 删除文章分类
// delete api/articlecategory/delete/:id
articlecategory.delete('/delete/:id', passport.authenticate('jwt', {
    session: false
}), async (req, res) => {
    try {
        const name = await ArticleCategory.findOneAndRemove({_id: req.params.id})
        return res.status(200).json('删除成功！')
    } catch (e) {
        return res.status(404).json('删除失败')
    }
})

module.exports = articlecategory