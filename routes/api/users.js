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
} = require('../../models/user');
const { nextTick } = require('process');

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
            return res.status(400).json({
                msg: '邮箱已被注册'
            })
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
        return res.status(400).json({
            msg: '请输入正确的用户信息'
        })
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
        return res.status(400).json({
            msg: '邮件地址或者密码错误!'
        })
    }
    // 根据邮箱地址查询用户信息
    // 如果查询到了用户信息user是对象类型
    // 如果没有查询到用户信息user为空
    let user = await User.findOne({
        email
    })
    // 查询到用户
    if (user) {
        // 判断用户是否被禁用
        if (user.state == 1) {
            return res.status(400).json({
                msg: '该用户已被禁用，请联系管理员!'
            })
        }
        // 将客户端传递过来的密码和用户信息中的密码进行对比
        const result = await bcrypt.compare(password, user.password);
        if (result) {
            // 登录成功
            // 给客户端返回token
            const rule = {
                id: user.id,
                name: user.username,
                email: user.email
            }
            jwt.sign(rule, 'privateKey', {
                expiresIn: 3600
            }, (err, token) => {
                if (err) throw err;
                res.json({
                    success: true,
                    token: 'Bearer ' + token
                })
            })
            // return res.json({msg: '登录成功'})
        } else {
            // 登录失败
            return res.status(400).json({
                msg: '邮件地址或者密码错误'
            })
        }
    } else {
        // 没有查询到用户
        return res.status(400).json({
            msg: '邮件地址或者密码错误哦'
        })
    }
})

// post api/users/add
// 添加用户接口
users.post('/add', passport.authenticate('jwt', {
    session: false
}), async (req, res) => {
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
            return res.status(400).json({
                msg: '邮箱已被注册'
            })
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
        return res.status(400).json({
            msg: '请输入正确的用户信息'
        })
    }
})

// get api/users
// 查询所有用户信息
users.get('/', passport.authenticate('jwt', {
    session: false
}), async (req, res) => {
    try {
        // 接收客户端传递过来的当前页参数
        let page = req.query.page || 1
        // 每一页显示的数据条数
        let pagesize = req.query.pagesize
        // 总的用户数
        let count = await User.countDocuments({})
        // 总页数
        let total = Math.ceil( count / pagesize)
        // 页码对应的数据查询开始位置
        let start = (page - 1) * pagesize
        // 将用户信息从数据库中查询出来
        
        console.log( pagesize ,start );
        const users = await User.find({}).limit(Number(pagesize)).skip(Number(start))
        res.json(users)
    } catch (e) {
        return res.status(404).json('没有任何数据')
    }
})

// get api/users/:id
// 查询单个用户信息
users.get('/:id', passport.authenticate('jwt', {
    session: false
}), async (req, res) => {
    try {
        const user = await User.findOne({_id: req.params.id})
        res.json(user)
    } catch (e) {
        return res.status(404).json('没有任何数据')
    }
})

// post api/users/edit/:id
// 修改用户信息接口
users.post('/edit/:id', passport.authenticate('jwt', {
    session: false
}), (req, res) => {
    const user = {}
    // 判断客户端发送过来的数据是否为空
    if (req.body.username && req.body.email && req.body.password 
        && req.body.role && req.body.state) {
        user.username = req.body.username
        user.email = req.body.email
        user.password = req.body.password
        user.role = req.body.role
        user.state = req.body.state

        // 对密码进行加密
        bcrypt.genSalt(10, function (err, salt) {
            bcrypt.hash(user.password, salt, async function (err, hash) {
                if (err) throw err;

                user.password = hash
                
                try {
                    const newUser = await  User.findOneAndUpdate({_id: req.params.id}, {$set: user}, {new: true})
        
                    res.json(newUser)
                } catch (e) {
                    return res.status(404).json('修改用户信息失败')
                }
            });
        });        
            
    } else {
        return res.status(400).json({
            msg: '请输入正确的用户信息'
        })
    }
})

// delete api/users/delete/:id
// 删除单个用户信息
users.delete('/delete/:id', passport.authenticate('jwt', {
    session: false
}), async (req, res) => {
    try {
        const user = await User.findOneAndRemove({_id: req.params.id})
        res.json(user)
        // user.save().then(user => res.json(user))
    } catch (e) {
        return res.status(404).json('删除失败')
    }
})



module.exports = users