var bigwheel = require('bigwheel');

module.exports = bigwheel(function(done) {

  done({
    routes: require('./routes')
  });

});
