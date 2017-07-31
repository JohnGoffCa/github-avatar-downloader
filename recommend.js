const getRepo = require("./download_avatars.js")

if (process.argv.length < 4) {
  console.log("Please provide at least two arguments, organization and repo");
  return;
}

function countStarred(url, object) {
  console.log(url)
}

var recommendedRepos = {};
getRepo(process.argv[2], process.argv[3], (err, result) => {
  if (err)
    console.log("Errors:", err);

  if (result.message === 'Not Found') {
    console.error("Repository Not Found");
    return;
  } else if (result.message === 'Bad credentials') {
    console.error("Improper Account Credentials in env file");
    return;
  }

  for (let i = 0; i < result.length; i++) {
    countStarred(result[i].starred_url.slice(0, -15), recommendedRepos);
  }
});
