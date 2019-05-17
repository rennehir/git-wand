require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const routes = require("./src/routes/GitMagicRouter"); //importing route
routes(app); //register the route

app.listen(port);

console.log("Lets do some GIT MAGIC on: " + port);
