const axios = require("axios");

module.exports = async () => {
  const jokeResponse = await axios.get("https://icanhazdadjoke.com/");
  return jokeResponse;
};
