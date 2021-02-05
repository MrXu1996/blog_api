// 创建用户集合
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 20
    },
    email: {
        type: String,
        // 保证邮箱地址不重复
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        // admin 超级管理员
        // normal 普通用户
        type: String,
        required: true
    },
    state: {
        type: Number,
        // 0：启用，1：禁用
        default: 0
    }
})

// 创建集合
const User = mongoose.model('User', userSchema)

// User.create({
//     username: 'xzh',
//     email: '916813946@qq.com',
//     password: 'xzhlove1314520',
//     role: 'admin',
//     state: 0
// }).then(() => {
//     console.log('用户创建成功');
// }).catch(() => {
//     console.log('失败');
// })

module.exports = { 
    User 
}