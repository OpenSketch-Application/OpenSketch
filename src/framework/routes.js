module.exports = {
  '/': '/home',
  '/home': {section: [require('../sections/Home/index')], overlap: false },
  '/whiteboard/:id': { section: [require('../sections/Whiteboard/index'), require('../sections/Whiteboard/ui/usergate/index')], overlap: false},
  '404': '/'
};
