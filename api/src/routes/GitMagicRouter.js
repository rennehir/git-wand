const gitMagic = require("../controllers/GitMagicController");

module.exports = app => {
  app.route("/simsalabim").get(gitMagic.add);

  app.route("/avada-kedavra").get(gitMagic.remove);

  app.route("/royh").get(gitMagic.braap);

  app.route("/blame").get(gitMagic.blame);

  app.route("/reparo").get(gitMagic.braap);
  app.route("/revelio").get(gitMagic.braap);
  app.route("/silencio").get(gitMagic.braap);
  app.route("/specialis_revelio").get(gitMagic.braap);
  app.route("/tarantallegra").get(gitMagic.braap);
};
