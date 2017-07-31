const getRepo = require("./download_avatars.js")

if (!fs.existsSync("./.env")) {
  console.error("No .env file found");
  return;
}

if (process.argv.length < 4) {
  console.log("Please provide at least two arguments, organization and repo");
  return;
}

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

  if (!fs.existsSync("./avatars"))
    fs.mkdirSync("./avatars");

  for (let i = 0; i < result.length; i++) {
    //do something...
  }
});
