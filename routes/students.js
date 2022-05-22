var express = require('express')
var router = express.Router()

// 新增学生
router.post('/addStudent', (req, res, next) => {
    // let data2 = db.collection('student').find(req.body.userName);
    // data2.toArray((err, result) => {
    //   let pass = result.filter(item => {
    //       return item.userName === req.body.userName
    //   })
    //   console.log(pass);
    // })
    let data = {
        userName: req.body.userName,
        password: req.body.password,
        // sex = 1 男， sex = 0 女
        sex: req.body.sex || 0,
        roles: 'student',
        address: req.body.address
    }
    // console.log(db);
    db.collection('students').insertOne(data, (err, result) => {
        if (err) throw err
        res.send({
            code: 200,
            msg: '新增学生成功'
        })
    })
})
// 搜索学生
router.post('/search', (req, res, next) => {
    let arr = []
    console.log(req.body.userName);
    let data = db.collection('students').find(
        // "userName": {$regex: /req.body.userName/i}
        // "userName": req.body.userName
        req.body
    )
    data.toArray((err, result) => {
        console.log(result);
        res.send({
            code: 200,
            msg: '搜索成功',
            data: result
        })
    })
})
// 学生列表详情
/* 
    @page: 默认1
    @pageSize: 默认5
*/
router.post('/studentList', async (req, res, next) => {
    let page = Number((req.body.page - 1) * Number(req.body.pageSize || 5))
    // 计算总条数
    let total = await db.collection('students').find().count()
    
    let data = db.collection('students').find().limit(req.body.pageSize || 5).skip(page);
    // let data = db.collection('students').find()
    data.toArray((err, result) => {
        if (err) throw err
        // console.log(result);
        result.length > 0 ? res.send({
            code: 200,
            msg: '学生列表获取成功',
            data: {
                list: result,
                pageSize: req.body.pageSize || 5,
                page: req.body.page || 1,
                total
            }
        }) : res.send({
            code: 200,
            msg: null,
            data: []
        })
    })
})
// 导出
module.exports = router