const axios = require("axios");

const {
  GITHUB_ACCESS_TOKEN,
  GITHUB_REPO_OWNER,
  GITHUB_REPO_NAME
} = process.env;

module.exports = async () => {
  const { data } = await axios({
    method: "GET",
    url: `https://api.github.com/repos/${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME}/collaborators`,
    headers: {
      Accept: "application/vnd.github.hellcat-preview+json",
      Authorization: `token ${GITHUB_ACCESS_TOKEN}`
    }
  });
  return data;
};
