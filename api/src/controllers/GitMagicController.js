const simpleGit = require("simple-git")(process.env.REPO_ABSOLUTE_PATH || null);
const player = require("play-sound")((opts = {}));
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
  player.play(audioFile, function(err) {
    if (err) throw err;
    console.log("Audio finished");
  });
  res.send("Röyh");
};

exports.blame = (req, res) => {
  const audioFile = __appDir + path.sep + "royh.mp3";
  player.play(audioFile, function(err) {
    if (err) throw err;
    console.log("Audio finished");
  });
  simpleGit.log(["-1"], (error, result) => {
    res.send(`You should probably blame ${result.latest.author_name}`);
  });
};
