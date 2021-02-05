// 引用 express 框架
const express = require('express')
// 创建博客展示页面路由
const admin = express.Router()

admin.get('/', (req, res) => {
    res.send('欢迎来到博客管理页面!')
})

// 将路由对象作为模块成员导出
module.exports = admin