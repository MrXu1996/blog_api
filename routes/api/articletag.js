const express = require('express');
// 导入jwt
const jwt = require('jsonwebtoken')
// 导入passport
const passport = require('passport')

// 导入文章标签集合构造函数
const {
    ArticleTag
} = require('../../models/articletag');

const articletag = express.Router();

// 添加文章标签
// post api/articletag/add
articletag.post('/add', passport.authenticate('jwt', {
    session: false
}), async (req, res) => {
    // 接收请求参数
    const {
        name
    } = req.body.tag;
    if (name) {
        let data = await ArticleTag.findOne({
            name
        })
        // 将客户端传递过来的邮箱和数据库中的邮箱进行对比
        if (data) {
            // 将客户端传递过来的邮箱和数据库中的邮箱进行对比
            return res.status(400).json({
                msg: '该标签已存在！'
            })
        } else {
            const newTag = new ArticleTag({
                name
            })
            newTag.save()
                .then(data => res.json(data))
                .catch(err => console.log(err));
        }
    }
})

// 查询文章标签
// get api/articletag/
articletag.get('/', passport.authenticate('jwt', {
    session: false
}), async (req, res) => {
    const names = await ArticleTag.find({})
    if (names) {
        return res.status(200).json({
            names
        })
    }
    return res.status(400).json('获取文章标签信息失败')
})

// get api/articletag/tagname/:name
// 查询单个标签信息
articletag.get('/tagname/:name', passport.authenticate('jwt', {
    session: false
}), async (req, res) => {
        if (!req.params.name) {
            return res.status(400).json("标签名不能为空");        
        }
        try {
            const reg = new RegExp(req.params.name)
            const tag = await ArticleTag.find({name: reg}) 
            res.json({tag}) 
        } catch(e) {
            return res.status(404).json({message: '没有数据！'})
        }
})

// get api/articletag/tagid/:id 根据标签id查询标签
articletag.get('/tagid/:id', passport.authenticate('jwt', {
    session: false
}), async (req, res) => {   
        if (!req.params.id) {
            return res.status(400).json("文章标签不能为空");        
        }
        try {
            const tag = await ArticleTag.find({_id: req.params.id}).populate('author').populate('category').populate('tag')
        res.json({tag}) 
        } catch(e) {
            return res.status(404).json({message: '没有数据！'})
        }
})

// 修改文章标签
// post api/articletag/edit/:id
articletag.post('/edit/:id', passport.authenticate('jwt', {
    session: false
}), async (req, res) => {
    const tag = {}
    // 判断客户端发送过来的数据是否为空
    const data = req.body.tag
    if (data) {
        tag.name = data.name
        const newTag = await ArticleTag.findOneAndUpdate({
            _id: req.params.id
        }, {
            $set: tag
        }, {
            new: true
        })
        return res.status(200).json('修改文章标签成功')

    } else {
        return res.status(400).json({
            msg: '修改文章标签失败'
        })
    }
})

// 删除文章标签
// delete api/articletag/delete/:id
articletag.delete('/delete/:id', passport.authenticate('jwt', {
    session: false
}), async (req, res) => {
    try {
        const name = await ArticleTag.findOneAndRemove({_id: req.params.id})
        return res.status(200).json('删除成功！')
    } catch (e) {
        return res.status(404).json('删除失败')
    }
})

module.exports = articletag