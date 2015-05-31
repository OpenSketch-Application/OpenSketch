module.exports = {
  // Database configuration
  dbName: 'test',
  host: 'localhost',
  port: 27017, // use default for now
  username: '',
  password: '',
  collection: 'sessions',
  getUri: function() {
    return 'mongodb://' +
    this.host + '/' +
    this.dbName;
  }
};
