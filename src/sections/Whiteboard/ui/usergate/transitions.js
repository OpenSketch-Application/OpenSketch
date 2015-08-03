var eases = require('eases');
module.exports = [
  { from: 'init', to: 'idle', animation: { duration: 1, ease: eases.quadOut } },
  { from: 'idle', to: 'init', animation: { duration: 0 } },
  { from: 'idle', to: 'out', animation: { duration: 1.5, ease: eases.expoInOut } }
];