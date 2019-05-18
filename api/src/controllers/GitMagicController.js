const simpleGit = require("simple-git/promise")(
  process.env.REPO_ABSOLUTE_PATH || null
);
const player = require("play-sound")((opts = {}));
const path = require("path");

const __appDir = path.dirname(require.main.filename);

exports.add = async (req, res) => {
  await simpleGit.add("./*");
  await simpleGit.commit("SIMSALABIM!!!!");
  await simpleGit.push(["-u", "origin", "master"]);
  res.send("ok");
};

exports.remove = async (req, res) => {
  try {
    await simpleGit.raw(["rm", ".", "-r"]);
    await simpleGit.commit("AVADA KEDAVRA!!!!!!!!!");
    await simpleGit.push(["-u", "origin", "master"]);
    res.send("Killed repo");
  } catch (error) {
    console.log(error);
  }
};

exports.braap = (req, res) => {
  const audioFile = __appDir + path.sep + "royh.mp3";
  player.play(audioFile, function(err) {
    if (err) throw err;
    console.log("Audio finished");
  });
  res.send("Röyh");
};

exports.blame = async (req, res) => {
  const audioFile = __appDir + path.sep + "kuka_gitis.mp3";
  player.play(audioFile, function(err) {
    if (err) throw err;
    console.log("Audio finished");
  });
  try {
    const { files } = await simpleGit.diffSummary(["HEAD^1"]);
    files.map(async file => {
      const blame = await simpleGit.raw(["blame", file.file, "-p"]);
      const rows = blame.split("\n");
      const committerRows = rows.filter(row => row.includes("committer "));
      const committer = committerRows[0].split(" ")[1];
      res.send(`Gitis on ${committer}`);
    });
  } catch (error) {
    res.send(error);
  }
};
