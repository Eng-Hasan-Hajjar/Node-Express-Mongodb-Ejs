var MongoClient = require('mongodb').MongoClient;

const url = 'mongodb://localhost:27017'
const dbName = 'project'

//تغليف طريقة ارتباط قاعدة البيانات
function connect (callback) {
  MongoClient.connect(url, function(err,client) {
    if (err) {
      console.log('خطأ في اتصال قاعدة البيانات', err);
    } else {
      var db = client.db(dbName);
      callback && callback(db)
      client.close();
    }
  })
}

module.exports = {
  connect
}