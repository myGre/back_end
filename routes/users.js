var express = require('express');
var router = express.Router();
// jsonwebtoken用于生成JWT字符串
// const jwt = require('jsonwebtoken')
const JwtUtil = require('../jwt')
let mdbUser = require('../libs/user')

// 登录页面post请求
router.post('/login', (req, res, next) => {
  mdbUser.login('admin', req.body, res)
})
// 初始化用户信息
router.post('/info', (req, res, next) => {
  mdbUser.info('admin', req, res)
})
// 修改自己的密码
router.post('/emitPassword', (req, res, next) => {
  mdbUser.emit('admin', req.body, res)
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