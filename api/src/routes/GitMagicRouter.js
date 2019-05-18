const gitMagic = require("../controllers/GitMagicController");
const express = require("express");
const magicRouter = express.Router();

magicRouter.use((req, res, next) => {
  let SPELL = req.url.substring(1).toUpperCase() + "!!!!!!!!!!!!!!!";
  console.log(SPELL);
  next();
});
magicRouter.get("/aguamenti", gitMagic.add);
magicRouter.get("/alohomora", gitMagic.commit);
magicRouter.get("/incendio", gitMagic.push);
magicRouter.get("/reparo", gitMagic.blame);
magicRouter.get("/revelio", gitMagic.joke);
magicRouter.get("/silencio", (req, res, next) => {
  gitMagic.braap(req, res);
  gitMagic.joke(req, res);
  res.send("BURP!")
  next();
});
magicRouter.get("/tarantallegra", gitMagic.playTheme);
magicRouter.get("/avada-kedavra", gitMagic.kill);
magicRouter.get("/blame", gitMagic.blame);

module.exports = magicRouter;
