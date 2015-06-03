module.exports = {
  '/': '/home',
  '/home': [require('../sections/Home/index.js')],
  '/whiteboard/:id': [require('../sections/Whiteboard/index.js')]
};
