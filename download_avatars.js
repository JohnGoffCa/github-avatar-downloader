var request = require('request');

const GITHUB_USER = "JohnTheScout";
const GITHUB_TOKEN = "b33459b0c6dd1ca9f0d84ba316e348f9a9837d96";

console.log('Welcome to the GitHub Avatar Downloader!');

function getRepoContributors(repoOwner, repoName, cb) {
  const requestURL = 'https://'+ GITHUB_USER + ':' + GITHUB_TOKEN + '@api.github.com/repos/' + repoOwner + '/' + repoName + '/contributors';
  
  const options = {
    url: requestURL,
    headers: {
      'User-Agent': "GitHub Avatar Scraper"
    },
  }

  request.get(options)
        .on("error", (err) => {
          throw err;
        })
        .pipe(process.stdout);

}

getRepoContributors("jquery", "jquery", function(err, result) {
  console.log("Errors:", err);
  console.log("Result:", result);
});
