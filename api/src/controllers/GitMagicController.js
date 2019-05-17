const play = require('play');
const path = require('path'),
  __appDir = path.dirname(require.main.filename);

exports.add = (req, res) => {
  console.log("Add");
  res.send("Add");
};

exports.remove = (req, res) => {
  console.log("Remove");
  res.send("Remove");
};

exports.braap = (req, res) => {
  var audioFile = __appDir + '/royh.mp3';
  play.sound(audioFile);
  res.send("Röyh");
};
