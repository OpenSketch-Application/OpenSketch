var test = require('tape');
var Promise = require('bluebird');
var User = require('../../db/DbManagers/UserManager');
var SeedDb = require('../../db/seedDatabase/seedDatabase');
var SESSION_ID = 'session1';

test('Testing User Manager methods', function(t) {
  SeedDb.seedDb()
    .then(function(res) {
      if(!res.length) {
        console.log('no results found');
        SeedDb.database.close();
        throw new Error('no results found');
      }

      console.log('results', res);
      t.ok(res.length === 1, 'Results are correct');
    })
    .then(function(res) {
      runPositiveTests(t)
      .then(function(t) {
        return runNegativeTests(t);
      })
      .then(function(t) {
        t.end();
        SeedDb.database.close();
      })
    })
});

function runPositiveTests(t) {
  return new Promise(function(resolve, reject) {
    t.ok(User && typeof User === 'object', 'User manager has loaded');
    t.ok(User.init && typeof User.init === 'function', 'User manager has init method');
    resolve();
  })
  .then(function(res) {
    return new Promise(function(resolve, reject) {
      resolve();
    })
  })
  .then(function(res) {
    return new Promise(function(resolve, reject) {
      t.ok(User.findAll && typeof User.findAll === 'function', 'findAll method exists');

        User.findAll(SESSION_ID, function(err, res) {
          if(err) reject(err);

          console.log('findAll', res);

          t.ok(typeof res === typeof [] && res.length === 0, 'findAll returned');

          resolve();
        });
    })
  })
  .then(function(res) {
    var user = {
      _id: 'Benson101',
      username: 'Benson',
      permissions: {
        canDraw : true,
        canChat : true
      },
      userRank: 1
    }
    return new Promise(function(resolve, reject) {
      User.addOne(SESSION_ID, user, function(err, result) {

        //console.log();
        t.ok(result && result._id && result._id === user._id, 'AddOne added user succesfully');

        resolve();
      })
    })
  })
  .then(function(res) {
    return new Promise(function(resolve, reject) {
      t.ok(User.findAll && typeof User.findAll === 'function', 'findAll method exists');

        User.findAll(SESSION_ID, function(err, res) {
          if(err) reject(err);

          console.log('findAll', res);

          t.ok(typeof res === typeof [] && res.length === 1, 'findAll returned');

          resolve();
        });
    })
  })
  .then(function() {
    return new Promise(function(resolve, reject) {
      t.ok(User.findOne && typeof User.findOne === 'function', 'findOne method exists');

        User.findOne(SESSION_ID, 'Benson101', function(err, res) {
          if(err) reject(err);

          console.log('findOne', res);

          t.ok(res && res._id === 'Benson101', 'findOne returned');

          resolve(res);
        });
    })
  })
  .then(function(user) {
    return new Promise(function(resolve, reject) {
      t.ok(User.updateOne && typeof User.updateOne === 'function', 'updateOne method exists');
        var user = {
          _id: 'Ragu244',
          username: 'Ragu',
          permissions: {
            canDraw : true,
            canChat : false
          },
          userRank: 6
        }

        User.updateOne(SESSION_ID, 'Benson101', user, function(err, res) {
          if(err) reject(err);

          console.log('updateOne', res);

          t.ok(res && res._id === 'Ragu244', 'updateOne returned');

          resolve(t);
        });
    })
  })
  // .then(function(user) {
  //   return new Promise(function(resolve, reject) {
  //     t.ok(User.deleteOne && typeof User.deleteOne === 'function', 'deleteOne method exists');

  //     User.deleteOne(SESSION_ID, 'Ragu244', function(err, res) {
  //       console.log('deleteOne', res);

  //       resolve(t);
  //     })
  //   })
  // })
  // .then(function() {
  //   return new Promise(function(resolve, reject) {
  //     t.ok(User.deleteAll && typeof User.deleteAll === 'function', 'deleteAll method exists');

  //     User.deleteAll(SESSION_ID, function(err, res) {
  //       console.log('deleteAll', res);

  //       resolve(t);
  //     })
  //   })
  // })
  .then(function() {
    return new Promise(function(resolve, reject) {
      t.ok(User.deleteSome && typeof User.deleteSome === 'function', 'deleteSome method exists');

      User.deleteSome(SESSION_ID, { '_id': 'Ragu244' }, function(err, res) {
        console.log('deleteSome', res);

        resolve(t);
      })
    })
  })
  .catch(function(err) {
    console.log(err);
    t.end();
    SeedDb.database.close();
  })
}

function runNegativeTests(t) {
  return new Promise(function(resolve, reject) {

    resolve(t);
  })
  .catch(function(err) {
    console.log(err);
    t.end();
    SeedDb.database.close();
  })
}

