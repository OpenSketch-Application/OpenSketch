module.exports = {
  '/': '/home',
  '/home': [require('../sections/Home/index')],
  '/whiteboard/:id': [require('../sections/Whiteboard/index'), require('../sections/Whiteboard/ui/usergate/index')]
};
