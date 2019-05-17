'use strict';

exports.list_all_vessels = function(req, res) {
  Vessel.find({}, function(err, vessel) {
    if (err)
      res.send(err);
    res.json(vessel);
  });
};




exports.add_a_vessel = function(req, res) {
  var new_vessel = new Vessel(req.body);
  new_vessel.save(function(err, vessel) {
    if (err)
      res.send(err);
    res.json(vessel);
  });
};


exports.get_a_vessel = function(req, res) {
  Vessel.findById(req.params.SHIP_ID, function(err, vessel) {
    if (err)
      res.send(err);
    res.json(vessel);
  });
};
