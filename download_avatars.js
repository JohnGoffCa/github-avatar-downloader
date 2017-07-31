const request = require('request');
const fs = require('fs');
require('dotenv').config()

console.log('Welcome to the GitHub Avatar Downloader!');

function getRepoContributors(repoOwner, repoName, cb) {
  const requestURL = 'https://' + process.env.GITHUB_USER + ':' + process.env.GITHUB_TOKEN + '@api.github.com/repos/' + repoOwner + '/' + repoName + '/contributors';
  
  const options = {
    url: requestURL,
    headers: {
      'User-Agent': "GitHub Avatar Scraper",
    },
  }

  let contributorsJSON = "";
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

function downloadImageByURL(url, filePath) {
  request.get(url)
      .on('error', (err) => {
         throw err;
      })
      .pipe(fs.createWriteStream(filePath));
}

if (process.argv.length < 4) {
  console.log("Please provide at least two arguments, organization and repo");
  return;
}

getRepoContributors(process.argv[2], process.argv[3], (err, result) => {
  if (err)
    console.log("Errors:", err);

  if (!fs.existsSync("./avatars"))
    fs.mkdirSync("./avatars");

  if (result.message === 'Not Found') {
    console.error("Repository Not Found");
    return;
  }

  for (let i = 0; i < result.length; i++) {
    //console.log(result[i]);
    downloadImageByURL(result[i].avatar_url, `./avatars/${result[i].login}.jpg`);
  }
});
