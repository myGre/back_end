var express = require('express');
const req = require('express/lib/request');
var router = express.Router()

// 新增学生
router.post('/addStudent', async (req, res, next) => {
    let data = db.collection('students');
    var total = await data.count()
    let pass = data.find({ userName: req.body.userName })
    pass.toArray((err, result) => {
        if (err) throw err
        if (result.length > 0) {
            res.send({
                code: 400,
                msg: '该学生已存在',
            })
        } else {
            let data = {
                id: total,
                userName: req.body.userName,
                password: req.body.password,
                regtime: new Date(),
                // sex = 1 男， sex = 0 女
                sex: req.body.sex || 0,
                roles: 'student',
                address: req.body.address
            }
            db.collection('students').insertOne(data, (err, result) => {
                if (err) throw err
                res.send({
                    code: 200,
                    msg: '新增学生成功'
                })
            })
        }
    })
})
// 编辑某一学生信息
router.post('/emitStudent', (req, res, next) => {
    let { id, userName, password, address, sex} = req.body
    db.collection('students').updateOne({ id }, {
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
    console.log(req.body);
    db.collection('students').deleteOne({id: req.body.id}, (err, result) => {
        if(err) throw err
        console.log(result);
        res.send({
            code: 200,
            msg: '删除成功'
        })
    })
})
// 搜索学生
router.post('/search', (req, res, next) => {
    let arr = []
    let data = db.collection('students').find(
        // "userName": {$regex: /req.body.userName/i}
        // "userName": req.body.userName
        req.body
    )
    data.toArray((err, result) => {
        // console.log(result);
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
    let total = await db.collection('students').find().count()
    let page = Number((req.body.page - 1) * Number(req.body.pageSize || 5))
    // 计算总条数
    let data = db.collection('students').find().sort({ id: -1 }).limit(req.body.pageSize || 5).skip(page);
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