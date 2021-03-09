// 创建文章标签集合
const mongoose = require('mongoose');

const articleTagSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 20
    }
})

// 创建集合
const ArticleTag = mongoose.model('ArticleTag', articleTagSchema)

// ArticleTag.create({
//     name: '前端工具'
// }).then(() => {
//     console.log('分类标签成功');
// }).catch(() => {
//     console.log('失败');
// })

module.exports = { 
    ArticleTag 
}