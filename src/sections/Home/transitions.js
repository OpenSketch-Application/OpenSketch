var eases = require('eases');
module.exports = [
  { from: 'init', to: 'idle', animation: { duration: 2, ease: eases.easeInOut } },
  { from: 'idle', to: 'init', animation: { duration: 0 } },
  { from: 'out', to: 'init', animation: { duration: 0 }},
  { from: 'idle', to: 'out', animation: { duration: 1, ease: eases.expoInOut } }
];