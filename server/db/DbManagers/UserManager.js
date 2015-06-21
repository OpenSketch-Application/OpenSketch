'use strict';
var Db = require('../../db/models/Session');

var User = {
  socket: null, // Instanstiated on init
  canvasSessionId: 0 // Instanstiated on init
};

var _this = User;

User.init = function(socket, canvasSessionId) {
  // Attach Socket to emit events
  _this.socket = socket;
  _this.canvasSessionId = canvasSessionId;
};

// Query or Retrieve methods
User.findOne = function(id, shapeId, callback) {
  Db.findOne(
    {
      '_id': id
    },
    {
      'users' : {
        $elemMatch: {
          '_id' : shapeId
        }
      }
    },
    {
      _id: false,
      'users': true
    },
    function(err, result) {
      if(err) callback(err, result);

      console.log(result);
      callback(err, result.users.length && result.users[0]);
    }
  );
};

//
User.findAll = function(id, callback) {
  Db.findById(id, function(err, session) {
    callback(err, session.users);
  });
};

//
User.findSome = function(criteria, callback) {
  Db
    .aggregate(
      { $match: { 'canvasId' : _this.canvasSessionId } },
      { $project: { _id: false, 'users': true } }
    )
    .exec(function(err, res) {
      callback(err, res);
    });
};

// Insert / Create methods
User.addOne = function(id, user, callback) {
  //console.log(_this.canvasSessionId);

  Db.findById(id, function(err, session) {

    session.users.push(user);

    session.save(function(err) {
      callback(err, user);
    })
  })
}

// .addAll()
User.addAll = function(id, shapes, callback) {
  if(!users.length) callback('addAll: Users need to be in an array', null);
  Session.findById(id, function(err, session) {

    session.users.addToSet.apply(session.users, users);

    session.save(function(err) {
      callback(err, session.users);
    })
  })
}

// .updateOne()
User.updateOne = function(id, userId, userProperties, callback) {
  Db
    .findOneAndUpdate(
      {
        '_id': id,
        'users._id': userId
      },
      {
        $set: {
          'users.$' : userProperties
        }
      },
      {
        'new': true,
        'select': {
          '_id': false,
          'users': {
            $elemMatch : {
              '_id': userProperties._id
            }
          }
        }
      },
      function(err, result) {
        if(err) callback(err, result);

        callback(err, result && result.users.length && result.users[0]);
      }
    )
}

// .updateAll()
// .updateSome()

// .deleteOne()
User.deleteOne = function(id, userId, callback) {
  Db.update(
    {
      '_id': id,
      'users._id': userId
    },
    {
      $unset: { 'users.$': '' }
    },
    function(err, result) {
      if(err) callback(err, result);

      callback(err, result);
    }
  )
}

// .deleteSome()
User.deleteSome = function(id, properties, callback) {
  Db.update(
    {
      '_id': id,
      'users':  { $elemMatch : properties }
    },
    {
      $unset: { 'users.$': '' }
    },
    function(err, result) {
      if(err) callback(err, result);

      callback(err, result);
    }
  )
}

// .deleteAll()
User.deleteAll = function(id, callback) {
  Db.update(
    {
      '_id': id
    },
    {
      $unset: { 'users': '' }
    },
    function(err, result) {
      if(err) callback(err, result);

      callback(err, result);
    }
  )
}

module.exports = User;















