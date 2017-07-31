var request = require('request');

const GITHUB_USER = "JohnTheScout";
const GITHUB_TOKEN = "b33459b0c6dd1ca9f0d84ba316e348f9a9837d96";

console.log('Welcome to the GitHub Avatar Downloader!');

function getRepoContributors(repoOwner, repoName, cb) {
  const requestURL = 'https://'+ GITHUB_USER + ':' + GITHUB_TOKEN + '@api.github.com/repos/' + repoOwner + '/' + repoName + '/contributors';
  
  const options = {
    url: requestURL,
    headers: {
      'User-Agent': "GitHub Avatar Scraper",
    },
  }

  var contributorsJSON = "";
  request.get(options)
        .on("error", (err) => {
          cb(err);
        })
        .on("data", (data) => {
          contributorsJSON += data;
        })
        .on("end", () => {
          cb(null, JSON.parse(contributorsJSON));
        });
}

getRepoContributors("jquery", "jquery", function(err, result) {
  if (!err)
    console.log("Errors:", err);
  for (let i = 0; i < result.length; i++) {
    console.log(`Avatar URL for contributor ${i}:  ${(result[i].avatar_url)}`);
  }
});
