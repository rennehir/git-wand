const simpleGit = require("simple-git")("/stupid-hack/stupid-repo");
const play = require("play");
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
  // simpleGit.rm('.')
  //          .commit("AVADA KEDAVRA!!!!!!!!!")
  //          .push(['-u', 'origin', 'master'], (err, result) => {
  //            res.send(result);
  //          });
};

exports.braap = (req, res) => {
  console.log("Röyh");
  res.send("Röyh");
};

exports.braap = (req, res) => {
  const audioFile = __appDir + "/royh.mp3";
  play.sound(audioFile);
  res.send("Röyh");
};

exports.blame = (req, res) => {
  const audioFile = __appDir + "/royh.mp3";
  play.sound(audioFile);
  res.send("Blame");
};
