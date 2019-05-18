const axios = require("axios");

module.exports = async () => {
  const {
    data: { joke }
  } = await axios.get("https://icanhazdadjoke.com", {
    headers: {
      Accept: "application/json"
    }
  });
  console.log(joke);
  return joke;
};
