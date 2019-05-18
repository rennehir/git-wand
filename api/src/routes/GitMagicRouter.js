const gitMagic = require("../controllers/GitMagicController");

module.exports = app => {
  app.route("/api/gitmagic/aguamenti").get(gitMagic.add);
  app.route("/api/gitmagic/alohomora").get(gitMagic.commit);
  app.route("/api/gitmagic/incendio").get(gitMagic.push);

  app.route("/api/gitmagic/locomotor").get(gitMagic.blame);
  app.route("/api/gitmagic/reparo").get(gitMagic.blame);
  app.route("/api/gitmagic/revelio").get(gitMagic.blame);

  app.route("/api/gitmagic/silencio").get(gitMagic.braap);
  app.route("/api/gitmagic/tarantallegra").get(gitMagic.braap);

  app.route("/api/gitmagic/avada-kedavra").get(gitMagic.kill);
  app.route("/api/gitmagic/blame").get(gitMagic.blame);
};
