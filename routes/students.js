var express = require('express');
var router = express.Router()
var mdb = require('../libs/config1')
// 新增学生
router.post('/addStudent',(req, res, next) => {
    // 添加数据库回调函数
    mdb.insert('students', req.body, res)
})
// 编辑某一学生信息
router.post('/emitStudent', (req, res, next) => {
    let {
        id,
        userName,
        password,
        address,
        sex
    } = req.body
    db.collection('students').updateOne({
        id
    }, {
        $set: {
            userName,
            password,
            address,
            sex
        }
    }, err => {
        if (err) throw err
        res.send({
            code: 200,
            msg: '修改成功'
        })
    })
})
// 删除某一学生
router.post('/del', (req, res, next) => {
    mdb.del('students', req.body.id, res)
})
// 搜索学生
router.post('/search', (req, res, next) => {
    mdb.search('students', req.body.userName, res)
})
// 学生列表详情
/* 
    @page: 默认1
    @pageSize: 默认5
*/
router.post('/studentList', async (req, res, next) => {
    mdb.studentList('students', req.body, res)
})
// 导出
module.exports = router