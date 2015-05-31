module.exports = {
    init: {
        textbox1: {
            alpha: 0,
            position: [ -10, 0, 0 ]
        },
        textbox2: {
            alpha: -1,
            position: [ -20, 53, 0 ]
        },
        textbox3: {
            alpha: -2,
            position: [ -30, 105, 0 ]
        }
    },
    idle: {
        textbox1: {
            alpha: 1,
            position: [ 0, 0, 0 ]
        },
        textbox2: {
            alpha: 1,
            position: [ 0, 53, 0 ]
        },
        textbox3: {
            alpha: 1,
            position: [ 0, 105, 0 ]
        }
    },
    out: {
        textbox: {
            alpha: 0,
            position: [ 0, 0, 0 ]
        }
    }
};

// module.exports = {
//     init: function(statename) {
//         return {
//             textbox: {
//                 alpha: 0,
//                 position: [ 0, 0, 0 ]
//             }
//         };
//     },
//     idle: function(statename) {
//         return {
//             textbox: {
//                 alpha: 1,
//                 position: [ 0, 50, 0 ]
//             }
//         };
//     },
//     out: function(statename) {
//         return {
//             textbox: {
//                 alpha: 0,
//                 position: [ 0, 0, 0 ]
//             }
//         };
//     }
// };