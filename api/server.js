require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const basePath = "/api/gitmagic"

const app = express();
const port = process.env.PORT || 3000;
const routes = require("./src/routes/GitMagicRouter"); //importing router

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(basePath, routes); //register the router

app.listen(port);

console.log("Lets do some GIT MAGIC on: " + port);
