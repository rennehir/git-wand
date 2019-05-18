const simpleGit = require("simple-git/promise")(
  process.env.REPO_ABSOLUTE_PATH || null
);
const player = require("play-sound")((opts = {}));
const path = require("path");
const prependFile = require("prepend-file");

const commitMessage = require("../utils/commitMessage");
const dadJokes = require("../utils/dadJokes");
const getCurrentBranch = require("../utils/currentBranch");
const killCollaborator = require("../utils/killCollaborator");

const __appDir = path.dirname(require.main.filename);

exports.add = async (req, res) => {
  await simpleGit.add("./*").catch(res.send);
  res.send("ADDED");
};

exports.commit = async (req, res) => {
  const { data } = await commitMessage();
  console.log(data);
  await simpleGit.commit(data).catch(res.send);
  res.send(data);
};

exports.push = async (req, res) => {
  try {
    const currentBranch = await getCurrentBranch(simpleGit);
    await simpleGit.push(["origin", currentBranch]);
    res.send("PUUUSH!");
  } catch (error) {
    res.send(error);
  }
};

exports.kill = async (req, res) => {
  const response = await killCollaborator().catch(console.log);
  res.send(response);
};

exports.playTheme = (req, res) => {
  const audioFile = __appDir + path.sep + "hp_theme.mp3";
  player.play(audioFile, err => {
    if (err) res.send(err);
    console.log("Theme playing finished");
  });
  res.send("Playing now");
};

exports.braap = (req, res) => {
  const audioFile = __appDir + path.sep + "royh.mp3";
  player.play(audioFile, err => {
    if (err) res.send(err);
    console.log("That was a good burp");
  });
};

exports.joke = async (req, res) => {
  const joke = await dadJokes();
  prependFile(
    process.env.REPO_ABSOLUTE_PATH + "/README.md",
    joke + "\n\n",
    err => {
      if (err) {
        res.send(err);
      }
      console.log("The '" + joke + "' was prepended to file!");
    }
  );
};

exports.blame = async (req, res) => {
  const audioFile = __appDir + path.sep + "kuka_gitis.mp3";
  player.play(audioFile, function(err) {
    if (err) res.send(err);
    console.log("Audio finished");
  });
  try {
    const { files } = await simpleGit.diffSummary(["HEAD^1"]);
    const committers = await Promise.all(
      files.map(async file => {
        const blame = await simpleGit.raw(["blame", file.file, "-p"]);
        const rows = blame.split("\n");
        const committerRows = rows.filter(row => row.includes("committer "));
        const committer = committerRows[0].split(" ")[1];
        return committer;
      })
    );
    res.send(`Gitis on ${committers[0]}`);
  } catch (error) {
    res.send(error);
  }
};
