const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient

let _db; // to be used only internally in this file

const mongoconnect = (callback) => {
  MongoClient.connect('mongodb+srv://coolsuedeadidas:1password1@cluster0.s9dqd5j.mongodb.net/shop?retryWrites=true&w=majority')
  .then(client => {
    console.log('Connected to MongoDB!')
    _db = client.db();
    callback();
  })
  .catch(err => {
    console.log(err);
    throw err; // to throw an error
  });
}

const getDb = () => {
  if (_db) {
    return _db;
  }
  throw 'No database found!';
}


exports.mongoconnect = mongoConnect;
exports.getDb = getDb;