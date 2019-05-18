const axios = require("axios");

const {
  GITHUB_ACCESS_TOKEN,
  GITHUB_REPO_OWNER,
  GITHUB_REPO_NAME,
  GITHUB_OWN_USERNAME
} = process.env;

const REPO_URL = `https://api.github.com/repos/${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME}`;

module.exports = async () => {
  const { data: collaborators } = await axios({
    method: "GET",
    url: `${REPO_URL}/collaborators`,
    headers: {
      Accept: "application/vnd.github.hellcat-preview+json",
      Authorization: `token ${GITHUB_ACCESS_TOKEN}`
    }
  }).catch(e => "Ur STUPUD");

  if (collaborators) {
    const filtered = collaborators.filter(c => c.login !== GITHUB_OWN_USERNAME);
    console.log(filtered);
    const killPromises = filtered.map(c => {
      const response = axios({
        method: "DELETE",
        url: `${REPO_URL}/collaborators/${c.login}`,
        headers: {
          Accept: "application/vnd.github.hellcat-preview+json",
          Authorization: `token ${GITHUB_ACCESS_TOKEN}`
        }
      }).catch(console.log);

      return response;
    });
    await Promise.all(killPromises);
  } else {
    console.log("No collaborators");
  }

  return "Not a collaborator";
};
