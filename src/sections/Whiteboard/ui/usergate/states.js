module.exports = {
    init: {
        shader: {
            alpha: 1,
            position: [ 0, 0, 0 ]
        },
        promptbox: {
            alpha: 1,
            position: [ 650, -1000, 0 ]
        }
    },
    idle: {
        shader: {
            alpha: 0.85,
            position: [ 0, 0, 0 ]
        },
        promptbox: {
            alpha: 1,
            position: [ 0, 0, 0 ]
        }
    },
    out: {
        shader: {
            alpha: 0,
            position: [ 0, 0, 0 ]
        },
        promptbox: {
            alpha: 1,
            position: [ 0, -1000, 0 ]
        }
    }
};