var express = require('express');
var router = express.Router();
// jsonwebtoken用于生成JWT字符串
// const jwt = require('jsonwebtoken')
const JwtUtil = require('../jwt')
let mdbUser = require('../libs/user')

// 登录页面post请求
router.post('/login', (req, res, next) => {
  if (req.body.userName && req.body.password) {
    let data = db.collection('admin').find();
    // console.log(data.toArray());
    data.toArray((err, result) => {
      let pass = result.filter(currentValue => {
        return currentValue.userName === req.body.userName && currentValue.password === req.body.password
      })
      if (pass.length) {
        // new一个新的实例对象
        let jwt = new JwtUtil(req.body.userName)
        // 继承原型上的生成token方法
        let tokenStr = jwt.generateToken()
        res.send({
          code: 200,
          msg: '登录成功',
          user: {
            userName: pass[0].userName,
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
// 初始化用户信息
router.post('/info', (req, res, next) => {
  // 通过解密token中的userName查找数据
  let token = req.headers.token;
  let jwt = new JwtUtil(token);
  let result = jwt.verifyToken();
  let data = db.collection('admin').find({userName: result})
  data.toArray((err, result) => {
    if(err) throw err
    res.send({
      code: 200,
      msg: '获取用户信息成功',
      user: result
    })
  })
})
// 修改自己的密码
router.post('/emitPassword', (req, res, next) => {
  mdbUser('admin', req.body, res)
})
// 新增管理员
router.post('/admin', (req, res, next) => {
  let data1 = []
  for (let i = 0; i < 10; i++) {
    let data = {
      id: i,
      userName: 'admin' + i,
      password: req.body.password,
      roles: 'admin'
    }
    data1.push(data)
  }
  // console.log(db); insertMany insertOne
  db.collection('admin').insertMany(data1, (err, result) => {
    if (err) throw err
    res.send({
      code: 200,
      msg: '新增管理员成功'
    })
  })
})
module.exports = router;