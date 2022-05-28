let url = 'mongodb://localhost:27017/mydb'
var JwtUtil = require('../jwt')

function connectDB(url) {
  let MongoClient = require('mongodb').MongoClient
  let client = MongoClient.connect(url, {
    useNewUrlParser: true
  })
  console.log('连接成功')
  return client
}
// 登录
exports.login = async function (collectionName, json, res) {
  let client = await connectDB(url)
  let db = client.db('mydb')
  let data = db.collection(collectionName).find();
  let {
    userName,
    password
  } = json
  data.toArray((err, result) => {
    let pass = result.filter(currentValue => {
      return currentValue.userName === userName && currentValue.password === password
    })
    if (pass.length) {
      // new一个新的实例对象
      let jwt = new JwtUtil(userName)
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
      let data = db.collection('students').find()
      data.toArray((err, result) => {
        let pass = result.filter(currentValue => {
          return currentValue.userName === userName && currentValue.password === password
        })
        if (pass.length) {
          // new一个新的实例对象
          let jwt = new JwtUtil(userName)
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
      })
    }
  });
}

// 获取用户信息
exports.info = async function (collectionName, json, res) {
  let client = await connectDB(url)
  let db = client.db('mydb')
  // 通过解密token中的userName查找数据
  let token = json.headers.token;
  let jwt = new JwtUtil(token);
  var result = jwt.verifyToken();
  // 在admin库中查找，如果没有则换另一个表继续查
  let data = db.collection(collectionName).find({
    userName: result
  })
  data.toArray((err, user) => {
    if (err) throw err
    if (user.length < 1) {
      // 在student库查找
      let data = db.collection('students').find({
        userName: result
      })
      data.toArray((err, user) => {
        if (err) throw err
        // 关闭数据库
        client.close().then(() => {
          console.log('关闭数据库成功');
        })
        res.send({
          code: 200,
          msg: '获取用户信息成功',
          user
        })
      })
    } else {
      // 关闭数据库
      client.close().then(() => {
        console.log('关闭数据库成功');
      })
      res.send({
        code: 200,
        msg: '获取用户信息成功',
        user
      })
    }
  })
}

// 修改自己的密码
exports.emit = async function (collectionName, json, res) {
  // 连接数据库
  let client = await connectDB(url)
  let db = client.db('mydb')
  let {
    _id,
    password
  } = json
  db.collection(collectionName).updateOne({
    _id
  }, {
    $set: {
      password
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

// 新增管理员
let num = 0
exports.addAdmin = async function (collectionName, json, res) {
  let client = await connectDB(url)
  let db = client.db('mydb')
  let data1 = []
  for (let i = 0; i < 10; i++) {
    num++
    let data = {
      id: num,
      userName: 'admin' + i,
      password: json.password,
      roles: ['admin']
    }
    data1.push(data)
  }
  // console.log(db); insertMany insertOne
  db.collection(collectionName).insertMany(data1, (err, result) => {
    if (err) throw err
    res.send({
      code: 200,
      msg: '新增管理员成功'
    })
  })
}