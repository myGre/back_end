var express = require('express');
var router = express.Router();
// jsonwebtoken用于生成JWT字符串
const jwt = require('jsonwebtoken')
// express-jwt用于将JWT字符串解析还原成JSON对象
const expressJWT = require('express-jwt')

// 定义secret秘钥
const secretKey = 'hello'


// 登录页面post请求
router.post('/', (req, res, next) => {
    if (req.body.userName && req.body.password) {
        let data = db.collection('admin').find();
        // console.log(data.toArray());
        data.toArray((err, result) => {
            let pass = result.filter(currentValue => {
                return currentValue.username === req.body.username && currentValue.password === req.body.password
            })
            if (pass.length) {
                /* 
                    登录成功生成token
                    参数1：用户信息 **不能把密码加密到token里
                    参数2：加密的秘钥
                    参数3：配置对象，可以是当前token的有效期
                */
                const tokenStr = jwt.sign({userName: pass[0].userName}, secretKey, { expiresIn: '30s'})
                res.send({
                    code: 200,
                    msg: '登录成功',
                    user: {
                        username: pass[0].userName,
                        password: pass[0].password,
                        roles: pass[0].roles,
                        token: tokenStr
                    }
                })
            } else {
                res.send({
                    code: 400,
                    msg: '用户名或密码错误'
                })
            }
        });
    } else {
        res.send({
            code: 400,
            msg: '无效权限'
        })
    }
})

module.exports = router;