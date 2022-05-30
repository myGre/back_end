// 公共数据文件
let url = 'mongodb://localhost:27017/mydb'
const mdb = require('./mongod')

// 计算学生自增_id
// db.collection('counter').insertOne({
//   _id: 'userId',
    // like: 1
// })
exports.increaseId = async function(db) {
  var result = await db.collection('counter').findOneAndUpdate(
      { _id: 'userId' },
      {$inc: { like: 1 } },
      {new:true}
  )
    return result.value.like
}

// 日期函数
exports.formatDate = function (date) {
  var y = date.getFullYear();
  var m = date.getMonth() + 1;
  m = m < 10 ? '0' + m : m;
  var d = date.getDate();
  d = d < 10 ? ('0' + d) : d;
  return y + '-' + m + '-' + d;
};
/**
 * @desc 删除数据库中的某条信息
 * @author xiaochao
 * @date 某年某月某日
 * @param {String} collectionName：具体要操作的集合
 * @param {String} _id：某条数据的_id
 */
 exports.del = async function (collectionName, _id, res) {
  let client = await mdb.connectDB(url)
  let db = client.db('mydb')
  db.collection(collectionName).deleteOne({
    _id
  }, (err, result) => {
    console.log(result);
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
 * @desc 列表数据的方法
 * @author xiaochao
 * @date 某年某月某日
 * @param {String} collectionName：具体要操作的集合
 * @param {Object} json：前台传过来的数据
 */
exports.listMsg = async function (collectionName, json, res) {
  let client = await mdb.connectDB(url)
  let db = client.db('mydb')
  // 计算总条数
  let total = null
  let page = Number((json.page - 1) * Number(json.pageSize || 5))
  let data = []
  // 根据userName查询
  if (json.userName) {
    total = await db.collection(collectionName).find({userName: { $regex: json.userName }}).count()
    data = db.collection(collectionName).find({userName: { $regex: json.userName }}).sort({
      _id: -1
    }).limit(json.pageSize || 5).skip(page);
  } else {

    total = await db.collection(collectionName).find().count()
    data = db.collection(collectionName).find().sort({
      _id: -1
    }).limit(json.pageSize || 5).skip(page);
  }
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
