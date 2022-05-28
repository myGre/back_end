/**
 * @desc 连接数据库的函数
 * @author Cherry
 * @date 某年某月某日
 * @param {String} url：数据库的地址
 */
let url = 'mongodb://localhost:27017/mydb'
const JwtUtil = require('../jwt')
const mdb = require('./mongod')
const communal = require('./communal')
/**
 * @desc 向数据库中插入数据的方法
 * @author Cherry
 * @date 某年某月某日
 * @param {String} collectionName：具体要操作的集合
 * @param {Object} json：要插入到数据库中的数据
 */
exports.insert = async function (collectionName, json, res) {
  // 连接数据库
  let client = await mdb.connectDB(url)
  let db = client.db('mydb')
  // 要存入数据库的数据
  let token = json.headers.token
  let jwt = new JwtUtil(token)
  let teacher = jwt.verifyToken()

  let userName = json.body.userName
  let password = json.body.password
  // sex = 1 男， sex = 0 女
  let sex = json.body.sex || 0
  let address = json.body.address
  // 在数据库中查找该学生是否存在
  let pass = db.collection(collectionName).find({
    userName: json.body.userName
  })
  pass.toArray( async(err, result) => {
    if (err) throw err
    if (result.length > 0) {
      res.send({
        code: 400,
        msg: '该学生已存在',
      })
    } else {
      // 新增数据
      let _id = await communal.increaseId(db)
      let data = {
        _id,
        parent: teacher,
        userName,
        password,
        regtime: communal.formatDate(new Date()),
        // sex = 1 男， sex = 0 女
        sex,
        roles: ['student'],
        address
      }
      db.collection(collectionName).insertOne(data, (err, result) => {
        if (err) throw err
        // 关闭数据库
        client.close().then(() => {
          console.log('关闭数据库成功');
        })
        res.send({
          code: 200,
          msg: '新增数据成功'
        })
      })
    }
  })
}

/**
 * @desc 向数据库修改数据的方法
 * @author Cherry
 * @date 某年某月某日
 * @param {String} collectionName：具体要操作的集合
 * @param {Object} json：要修改的数据
 */
exports.emit = async function (collectionName, json, res) {
  let client = await mdb.connectDB(url)
  let db = client.db('mydb')
  let {
    _id,
    userName,
    password,
    address,
    sex
  } = json
  db.collection(collectionName).updateOne({
    _id
  }, {
    $set: {
      userName,
      password,
      address,
      sex
    }
  }, err => {
    if (err) throw err
    client.close(() => {
      console.log('关闭数据库成功');
    })
    res.send({
      code: 200,
      msg: '修改成功'
    })
  })
}
