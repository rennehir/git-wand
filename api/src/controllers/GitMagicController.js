//const simpleGit = require("simple-git")("/stupid-hack/stupid-repo");
const player = require('play-sound')(opts = {})
const path = require("path");

const __appDir = path.dirname(require.main.filename);

exports.add = (req, res) => {
  simpleGit
  .add("./*")
  .commit("SIMSALABIM!!!!")
  .push(["-u", "origin", "master"], (err, result) => {
    res.send(result);
  });
};

exports.remove = (req, res) => {
  simpleGit
  .raw(["rm", ".", "-r"])
  .commit("AVADA KEDAVRA!!!!!!!!!")
  .push(["-u", "origin", "master"], (err, result) => {
     res.send(result);
  });
};

exports.braap = (req, res) => {
  const audioFile = __appDir + path.sep + "royh.mp3";
  player.play(audioFile, function (err) {
    if (err) throw err;
    console.log("Audio finished");
  });
  res.send("Röyh");
};

exports.blame = (req, res) => {
  const audioFile = __appDir + path.sep + "royh.mp3";
  player.play(audioFile, function (err) {
    if (err) throw err;
    console.log("Audio finished");
  });
  res.send("Blame");
};
