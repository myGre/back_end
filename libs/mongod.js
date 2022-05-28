/**
 * @desc 连接数据库的函数
 * @author Cherry
 * @date 某年某月某日
 * @param {String} url：数据库的地址
 */
 exports.connectDB = function(url) {
   let MongoClient = require('mongodb').MongoClient
   let client = MongoClient.connect(url, {
     useNewUrlParser: true
   })
   console.log('连接成功')
   return client
 }
 