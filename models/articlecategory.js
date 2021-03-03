// 创建文章分类集合
const mongoose = require('mongoose');

const articleCategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 20
    }
})

// 创建集合
const ArticleCategory = mongoose.model('ArticleCategory', articleCategorySchema)

// ArticleCategory.create({
//     name: '推荐'
// }).then(() => {
//     console.log('分类创建成功');
// }).catch(() => {
//     console.log('失败');
// })

module.exports = { 
    ArticleCategory 
}