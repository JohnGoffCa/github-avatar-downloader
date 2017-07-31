const getRepo = require("./download_avatars")
const request = require("request")
require('dotenv').config()

if (process.argv.length < 4) {
  console.log("Please provide at least two arguments, organization and repo");
  return;
}

let recommendedRepos = {};
let requestsPending = 0;
let requestsFinished = 0;

function getStarredByUser(url, object, cb) {
  const urlWithHeader = {
    url: url,
    headers: {
      'User-Agent': "Count Starred Repos",
    },
  }

  let starredByUser = ""
  request.get(urlWithHeader)
        .on('error', (err) => {
          cb(err);
        })
        .on('data', (data) => {
          starredByUser += data;
        })
        .on('end', () => {
          var starredBy = JSON.parse(starredByUser);
          starredBy.forEach((elem) => {
            if (object.hasOwnProperty(elem.full_name)) {
              object[elem.full_name] += 1;
            } else {
              object[elem.full_name] = 1
            }
          });

          requestsFinished++;
          if (requestsFinished === requestsPending) 
            cb(null, object);
        });
}

function printStarred(err, object) {
  if (err) {
    throw err
  }

  let sorted = sortProperties(object);
  for (let i = 0; i < sorted.length && i < 5; i++) {
    console.log(`[${sorted[i][1]} stars] - ${sorted[i][0]}`);
  }
}

//from https://gist.github.com/umidjons/9614157
function sortProperties(obj) {
  // convert object into array
	var sortable = [];
	for (var key in obj)
		if (obj.hasOwnProperty(key))
			sortable.push([key, obj[key]]); // each item is an array in format [key, value]
	
	// sort items by value
	sortable.sort(function(a, b)
	{
	  return b[1]-a[1]; // compare numbers
	});
	return sortable; // array in format [ [ key1, val1 ], [ key2, val2 ], ... ]
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

  console.log(`Based on ${process.argv[2]}/${process.argv[3]} you might like: `);
  requestsPending = result.length;
  for (let i = 0; i < requestsPending; i++) {
    getStarredByUser(`https://${process.env.GITHUB_USER}:${process.env.GITHUB_TOKEN}@api.github.com/users/${result[i].login}/starred`, recommendedRepos, printStarred);
  }
});
