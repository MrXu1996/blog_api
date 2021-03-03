// 引用 express 框架
const express = require('express')
// 引入body-parser用来处理post请求参数
const bodyParser = require('body-parser')
// 引入 passport
const passport = require('passport')

// 导入express-session模块
// const session = require('express-session')

// 导入 dateformat 第三方模块
const dateFormat = require('dateformat')

// 创建网站服务器
const app = express()
// 数据库连接
require('./models/connect')

// 处理post请求参数
app.use(bodyParser.urlencoded({
    extended: true
}))
app.use(bodyParser.json());

// passport初始化 
app.use(passport.initialize())
require('./config/passport')(passport)

// 配置session
// app.use(session({secret: 'secret key'}))
// app.use(session({
//     resave: false, //添加 resave 选项
//     saveUninitialized: true, //添加 saveUninitialized 选项
//     secret: 'secret key'
//   }));

// 设置cors跨越请求
app.all('*', (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')    
    res.header('Access-Control-Allow-Headers', 'X-Requested-With, mytoken')
    res.header('Access-Control-Allow-Headers', 'X-Requested-With, Authorization')
    res.setHeader('Content-Type', 'application/json;charset=utf-8')
    res.header('Access-Control-Allow-Headers', 'Content-Type,Content-Length, Authorization, Accept,X-Requested-With')
    res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS')
    res.header('X-Powered-By', ' 3.2.1')
    // if (req.method == 'OPTIONS') res.send(200)
    /*让options请求快速返回*/
    // else 
    next()
})

// 引入路由模块
const users = require('./routes/api/users')
const articles = require('./routes/api/articles')
const articlecategory = require('./routes/api/articlecategory')

// 为路由匹配请求路径
app.use('/api/users', users)
app.use('/api/articles', articles)
app.use('/api/articlecategory', articlecategory)

app.use(express.static('public'))

// 监听端口
app.listen(9090);
console.log('网站服务启动成功');