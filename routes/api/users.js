const express = require('express');
// 导入加密算法bcrypt 
const bcrypt = require('bcrypt')
// 导入jwt
const jwt = require('jsonwebtoken')
// 导入passport
const passport = require('passport')
// 导入用户集合构造函数
const {
    User
} = require('../../models/user')

const users = express.Router();

// post api/users/register 注册接口
users.post('/register', async (req, res) => {
    // 接收请求参数
    const {
        username,
        email,
        password,
        role,
        state
    } = req.body;
    // 判断客户端发送过来的数据是否为空
    if (username && email && password && role && state) {
        // 如果查询到了用户信息user是对象类型
        // 如果没有查询到用户信息user为空
        let user = await User.findOne({
            email
        })
        // 将客户端传递过来的邮箱和数据库中的邮箱进行对比
        if (user) {
            // 将客户端传递过来的邮箱和数据库中的邮箱进行对比
            return res.status(400).json({msg : '邮箱已被注册'})
        } else {
            const newUser = new User({
                username,
                email,
                password,
                role,
                state
            })

            // 对密码进行加密
            bcrypt.genSalt(10, function (err, salt) {
                bcrypt.hash(newUser.password, salt, function (err, hash) {
                    if (err) throw err;

                    newUser.password = hash

                    newUser.save()
                        .then(user => res.json(user))
                        .catch(err => console.log(err));
                });
            });
        }
    } else {        
        return res.status(400).json({msg : '请输入正确的用户信息'})
    }
})

// post api/users/login 登录接口
users.post('/login', async (req, res) => {
    // 接收请求参数    
    const {
        email,
        password
    } = req.body;
    // 如果用户没有输入邮件地址
    if (email.trim().length == 0 || password.trim().length == 0) {
        return res.status(400).json({msg : '邮件地址或者密码错误!'})
    }
    // 根据邮箱地址查询用户信息
    // 如果查询到了用户信息user是对象类型
    // 如果没有查询到用户信息user为空
    let user = await User.findOne({
        email
    })
    // 查询到用户
    if (user) {
        // 将客户端传递过来的密码和用户信息中的密码进行对比
        const result = await bcrypt.compare(password, user.password);
        if (result) {
            // 登录成功
            // 给客户端返回token
            const rule = {id: user.id, name: user.username}
            jwt.sign(rule, 'privateKey', { expiresIn: 3600}, (err, token) => {
                if (err) throw err;
                res.json({
                    success: true,
                    token: 'Bearer ' + token
                })
            })
            // return res.json({msg: '登录成功'})
        } else {
            // 登录失败
            return res.status(400).json({msg : '邮件地址或者密码错误'})
        }
    } else {
        // 没有查询到用户
        return res.status(400).json({msg : '邮件地址或者密码错误哦'})
    }
})

// get api/users/list
// 创建用户列表路由
users.get('/list', passport.authenticate('jwt',{session: false}) ,(req, res) => {
    res.json({
        'username': req.user.username,
        'email': req.user.email
    })  
})

users.get('/test', (req, res) => {
    res.json('测试')
})

module.exports = users