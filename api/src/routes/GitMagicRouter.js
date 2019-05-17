'use strict';
module.exports = function(app) {
  var vessels = require('../controllers/VesselController');

  // todoList Routes
  app.route('/vessels')
    .get(vessels.list_all_vessels)
    .post(vessels.add_a_vessel);


  app.route('/vessels/:SHIP_ID')
    .get(vessels.get_a_vessel);
};
