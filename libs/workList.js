/**
 * @desc 连接数据库的函数
 * @author Cherry
 * @date 某年某月某日
 * @param {String} url：数据库的地址
 */
let url = 'mongodb://localhost:27017/mydb'
var mdb = require('../libs/mongod')
var communal = require('../libs/communal')
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
  let handyGame = json.handyGame
  let remark = json.remark 
  let time = json.time
  // 在数据库中查找该作业是否存在
  let pass = db.collection(collectionName).find({
    handyGame: json.handyGame
  })
  pass.toArray( async(err, result) => {
    if (err) throw err
    if (result.length > 0) {
      res.send({
        code: 400,
        msg: '该游戏已存在',
      })
    } else {
      // 新增数据
      let data = {
        _id: await communal.increaseId2(db) ,
        handyGame,
        remark,
        addTime: communal.formatDate(new Date()),
        time
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
 * @desc 查询数据
 * @author Cherry
 * @date 某年某月某日
 * @param {String} collectionName：具体要操作的集合
 * @param {String} name：要查询的数据
 */
exports.search = async function (collectionName, name, res) {
  // 连接数据库
  let client = await mdb.connectDB(url)
  let db = client.db('mydb')
  let data = db.collection(collectionName).find({
    handyGame: {$regex: name}
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
    addTime,
    handyGame,
    remark,
    time
  } = json
  db.collection(collectionName).updateOne({
    _id
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
