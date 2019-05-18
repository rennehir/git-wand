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

  if (
    collaborators &&
    collaborators.filter(c => c.login === GITHUB_OWN_USERNAME).length > 0
  ) {
    const response = await axios({
      method: "DELETE",
      url: `${REPO_URL}/collaborators/${GITHUB_OWN_USERNAME}`,
      headers: {
        Accept: "application/vnd.github.hellcat-preview+json",
        Authorization: `token ${GITHUB_ACCESS_TOKEN}`
      }
    }).catch(console.log);

    console.log(response);
    return "KYS";
  }

  return "Not a collaborator";
};
