var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
// router.post('/', function(req, res, next) {
//   res.send('respond with a resource');
// });
// 初始化用户信息
router.post('/info', (req, res, next) => {

})
// 新增管理员
router.post('/admin', (req, res, next) => {
  let data2 = db.collection('admin').find();
  let data = {
      useName: req.body.useName,
      password: req.body.password,
      roles: 'admin'
  }
  // console.log(db);
  db.collection('admin').insertOne(data, (err, result) => {
      if (err) throw err
      res.send({
          code: 200,
          msg: '新增管理员成功'
      })
  })
})
module.exports = router;
