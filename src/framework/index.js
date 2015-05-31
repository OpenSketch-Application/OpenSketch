var bigwheel = require('bigwheel');

module.exports = bigwheel(function(done) {

  done({
    routes: require('../model/routes')
  });

});
