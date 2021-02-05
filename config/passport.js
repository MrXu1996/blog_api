var JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;
const mongoose = require("mongoose");
// 导入用户集合构造函数
const {
    User
} = require('../models/user')

var opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken(); //通过配置信息来生成jwt的请求，验证这个token
opts.secretOrKey = 'privateKey';

module.exports = passport => {
    passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
        console.log(jwt_payload);
        User.findById(jwt_payload.id)
            .then(user => {
                if(user) {
                    return done(null, user)
                }
                return done(null, false)
            })
            .catch(err => console.log(err))
    }))
}