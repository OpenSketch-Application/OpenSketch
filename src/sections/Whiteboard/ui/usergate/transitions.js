var eases = require('eases');
module.exports = [
  { from: 'init', to: 'idle', animation: { duration: 2, ease: eases.quadIn } },
  { from: 'idle', to: 'init', animation: { duration: 0 } },
  { from: 'idle', to: 'out', animation: { duration: 0, ease: eases.expoInOut } }
];