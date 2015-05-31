var eases = require('eases');
module.exports = [
    'init', 'idle', { duration:0.5, ease: eases.expoInOut },
    'idle', 'init', { duration: 0},
    'out', 'init', { duration: 0},
    'idle', 'out', { duration:0.5, ease: eases.expoInOut }
];