var bigwheel = require('bigwheel');

module.exports = bigwheel(function(done) {
  done({
    overlap: false,
    routes: require('./routes')
  });
});
