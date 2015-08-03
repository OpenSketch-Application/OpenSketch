var eases = require('eases');
module.exports = [
  { from: 'init', to: 'idle', animation: { duration: 1, ease: eases.easeIn } },
  { from: 'idle', to: 'init', animation: { duration: 0 } },
  { from: 'idle', to: 'out', animation: { duration: 0, ease: eases.expoInOut } }
];