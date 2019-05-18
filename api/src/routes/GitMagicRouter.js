const gitMagic = require("../controllers/GitMagicController");
const express = require('express');
const magicRouter = express.Router();

magicRouter.use((req, res, next) => {
  let SPELL = req.url.substring(1).toUpperCase()+"!!!!!!!!!!!!!!!";
  console.log(SPELL);
  next();
});
magicRouter.get("/aguamenti", gitMagic.add);
magicRouter.get("/alohomora", gitMagic.commit);
magicRouter.get("/incendio", gitMagic.push);
magicRouter.get("/reparo", gitMagic.blame);
magicRouter.get("/revelio", gitMagic.joke);
magicRouter.get("/silencio", gitMagic.braap);
magicRouter.get("/tarantallegra", gitMagic.braap);
magicRouter.get("/avada-kedavra", gitMagic.braap);
magicRouter.get("/blame", gitMagic.blame);

module.exports = magicRouter;
