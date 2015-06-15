module.exports = {
    init: {
        usergate: {
            alpha: 1,
            position: [ 0, 0, 0 ]
        },
        promptbox: {
            alpha: 0,
            position: [ 0, 1000, 0 ]
        }
    },
    idle: {
        usergate: {
            alpha: 0.8,
            position: [ 0, 0, 0 ]
        },
        promptbox: {
            alpha: 1,
            position: [ 0, 0, 0 ]
        }
    },
    out: {
        usergate: {
            alpha: 0,
            position: [ 0, 0, 0 ]
        },
        promptbox: {
            alpha: 0,
            position: [ 0, 0, 0 ]
        }
    }
};