/**
 * @desc 连接数据库的函数
 * @author Cherry
 * @date 某年某月某日
 * @param {String} url：数据库的地址
 */
let url = 'mongodb://localhost:27017/mydb'

function connectDB(url) {
  let MongoClient = require('mongodb').MongoClient
  let client = MongoClient.connect(url, {
    useNewUrlParser: true
  })
  console.log('连接成功')
  return client
}

/**
 * @desc 向数据库中插入数据的方法
 * @author Cherry
 * @date 某年某月某日
 * @param {String} collectionName：具体要操作的集合
 * @param {Object} json：要插入到数据库中的数据
 */
exports.insert = async function (collectionName, json, res) {
  // 连接数据库
  let client = await connectDB(url)
  let db = client.db('mydb')
  let total = await db.collection(collectionName).count()
  // 要存入数据库的数据
  let data = {
    id: total,
    handyGame: json.handyGame,
    remark: json.remark,
    addTime: formatDate(new Date()),
    time: json.time
  }
  // 在数据库中查找该学生是否存在
  let pass = db.collection(collectionName).find({
    handyGame: json.handyGame
  })
  pass.toArray((err, result) => {
    if (err) throw err
    if (result.length > 0) {
      res.send({
        code: 400,
        msg: '该游戏已存在',
      })
    } else {
      // 新增数据
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
 * @desc 查询数据
 * @author Cherry
 * @date 某年某月某日
 * @param {String} collectionName：具体要操作的集合
 * @param {String} name：要查询的数据
 */
exports.search = async function (collectionName, name, res) {
  // 连接数据库
  let client = await connectDB(url)
  let db = client.db('mydb')
  let data = db.collection(collectionName).find({
    handyGame: name
  })
  let total = await data.count()
  data.toArray((err, result) => {
    // 关闭数据库
    client.close().then(() => {
      console.log('关闭数据库成功');
    })
    res.send({
      code: 200,
      msg: '搜索成功',
      data: result,
      total
    })
  })

}

/**
 * @desc 学生列表数据的方法
 * @author xiaochao
 * @date 某年某月某日
 * @param {String} collectionName：具体要操作的集合
 * @param {Object} json：前台传过来的数据
 */
exports.studentList = async function (collectionName, json, res) {
  let client = await connectDB(url)
  let db = client.db('mydb')
  let total = await db.collection(collectionName).count()
  let page = Number((json.page - 1) * Number(json.pageSize || 5))
  // 计算总条数
  let data = db.collection(collectionName).find().sort({
    id: -1
  }).limit(json.pageSize || 5).skip(page);
  // let data = db.collection('students').find()
  data.toArray((err, result) => {
    if (err) throw err
    // console.log(result);
    client.close(() => {
      console.log('关闭数据库成功');
    })
    res.send({
      code: 200,
      msg: '学生列表获取成功',
      data: {
        list: result,
        pageSize: json.pageSize || 5,
        page: json.page || 1,
        total
      }
    })
  })
}
/**
 * @desc 删除数据库中的某条信息
 * @author xiaochao
 * @date 某年某月某日
 * @param {String} collectionName：具体要操作的集合
 * @param {String} id：某条数据的ID
 */
exports.del = async function (collectionName, id, res) {
  let client = await connectDB(url)
  let db = client.db('mydb')
  db.collection(collectionName).deleteOne({
    id
  }, (err, result) => {
    if (err) throw err
    client.close(() => {
      console.log('关闭数据库');
    })
    res.send({
      code: 200,
      msg: '删除成功'
    })
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
  let client = await connectDB(url)
  let db = client.db('mydb')
  let {
    id,
    addTime,
    handyGame,
    remark,
    time
  } = json
  db.collection(collectionName).updateOne({
    id
  }, {
    $set: {
      addTime,
      handyGame,
      remark,
      time
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

var formatDate = function (date) {
  var y = date.getFullYear();
  var m = date.getMonth() + 1;
  m = m < 10 ? '0' + m : m;
  var d = date.getDate();
  d = d < 10 ? ('0' + d) : d;
  return y + '-' + m + '-' + d;
};