const gitMagic = require("../controllers/GitMagicController");

module.exports = app => {
  app.route("/simsalabim").get(gitMagic.add);

  app.route("/avada-kedavra").get(gitMagic.remove);

  app.route("/royh").get(gitMagic.braap);

  app.route("/blame").get(gitMagic.blame);
};
