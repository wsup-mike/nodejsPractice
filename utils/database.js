const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

MongoClient.connect('mongodb+srv://coolsuedeadidas:password@cluster0.s9dqd5j.mongodb.net/?retryWrites=true&w=majority')
  .then(result => {
    console.log('Connected to MongoDB!')
  })
  .catch(err => console.log(err));
