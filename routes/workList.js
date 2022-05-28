var express = require('express')
var router = express.Router()
var mdb = require('../libs/workList')
var communal = require('../libs/communal')

// 新增游戏
router.post('/addGame',(req, res, next) => {
  // 添加数据库回调函数
  mdb.insert('workList', req.body, res)
})
// 编辑某一游戏
router.post('/emitGame', (req, res, next) => {
  mdb.emit('workList', req.body, res)
})
// 删除某一游戏
router.post('/del', (req, res, next) => {
  communal.del('workList', req.body._id, res)
})
// 搜索游戏
router.post('/search', (req, res, next) => {
  mdb.search('workList', req.body.handyGame, res)
})
// 学生列表详情
/* 
  @page: 默认1
  @pageSize: 默认5
*/
router.post('/gameList', async (req, res, next) => {
  communal.listMsg('workList', req.body, res)
})
// 导出
module.exports = router