let url = 'mongodb://localhost:27017/mydb'

function connectDB(url) {
  let MongoClient = require('mongodb').MongoClient
  let client = MongoClient.connect(url, {
    useNewUrlParser: true
  })
  console.log('连接成功')
  return client
}

exports.emit = async function (collectionName, json, res) {
  // 连接数据库
  let client = await connectDB(url)
  let db = client.db('mydb')
  let { id, password1, password2} = json
  db.collection(collectionName).updateOne({
    id
  }, {
    $set: {
      password1,
      password2,
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