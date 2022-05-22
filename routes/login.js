var express = require('express');
var router = express.Router();

// router.post('/', (req, res, next) => {
//     // let data2 = db.collection('student').find(req.body.userName);
//     // data2.toArray((err, result) => {
//     //   let pass = result.filter(item => {
//     //       return item.userName === req.body.userName
//     //   })
//     //   console.log(pass);
//     // })
//     let data = {
//         userName: req.body.userName,
//         password: req.body.password,
//         // sex = 1 男， sex = 0 女
//         sex: req.body.sex || 0,
//         roles: 'admin',
//         address: req.body.address
//     }
//     // console.log(db);
//     db.collection('admin').insertOne(data, (err, result) => {
//         if (err) throw err
//         res.send({
//             code: 200,
//             msg: '新增学生成功'
//         })
//     })
// })
// 登录页面post请求
router.post('/', (req, res, next) => {
    if (req.body.userName && req.body.password) {
        let data = db.collection('admin').find();
        // console.log(data.toArray());
        data.toArray((err, result) => {
            let pass = result.filter(currentValue => {
                return currentValue.username === req.body.username && currentValue.password === req.body.password
            })
            console.log(pass);
            pass.length > 0 ? res.send({
                code: 200,
                msg: '登录成功',
                user: {
                    username: pass[0].userName,
                    password: pass[0].password,
                    roles: pass[0].roles
                }
            }) : res.send({
                code: 400,
                msg: '用户名或密码错误'
            })
        });
    } else {
        res.send({
            code: 400,
            msg: '无效权限'
        })
    }
})

module.exports = router;