const gitMagic = require("../controllers/GitMagicController");

module.exports = app => {
  app.route("/simsalabim").get(gitMagic.add);

  app.route("/avada-kedavra").get(gitMagic.remove);
};
