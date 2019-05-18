const gitMagic = require("../controllers/GitMagicController");

module.exports = app => {
  app.route("/api/gitmagic/aguamenti").get(gitMagic.add);

  app.route("/api/gitmagic/avada-kedavra").get(gitMagic.remove);

  app.route("/api/gitmagic/incendio").get(gitMagic.braap);

  app.route("/api/gitmagic/blame").get(gitMagic.blame);
};
