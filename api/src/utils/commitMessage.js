const axios = require("axios");

module.exports = async () => {
  const message = await axios.get("https://whatthecommit.com/index.txt");
  return message;
};
