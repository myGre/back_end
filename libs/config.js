// 连接mongodb
let MongoClient = require('mongodb').MongoClient
let url = 'mongodb://localhost:27017/mydb'

// 导出
module.exports = async function(){
    const client = await MongoClient.connect(url, {useNewUrlParser: true})
    console.log('数据库连接成功')
    db = client.db('mydb')
    return db

}