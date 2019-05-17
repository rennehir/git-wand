const express = require('express'),
  app = express(),
  port = process.env.PORT || 3000,
  bodyParser = require('body-parser');

// mongoose instance connection url connection
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


const routes = require('./src/routes/GitMagicRouter'); //importing route
routes(app); //register the route


app.listen(port);


console.log('Lets do some GIT MAGIC on: ' + port);
