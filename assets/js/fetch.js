let commentArr = [];


// fetch the wallstreet bets api
var token
var userName = "upojT-rxULWxHaohV2favg"; // app client ID
var password = "MUqZZ5kKtbug12ThYb5lUqZmFeg4YA"; // app clientSecret
var tokenUrl = "https://www.reddit.com/api/v1/access_token"; // application token endpoint
let tokenReq = new XMLHttpRequest();

function getToken(url, clientID, secret) {
    var key;
    // XMLHttpRequest methods
    tokenReq.open("POST", url, true)
    tokenReq.setRequestHeader("Authorization", "Basic " + btoa(clientID + ":" + secret)); // call params that for client id and secret
    tokenReq.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
    tokenReq.send("grant_type=client_credentials&client_id="+clientID+"&"+"client_secret="+secret);  // send credentials to api
    tokenReq.addEventListener ("load", function() {
        if (tokenReq.status >= 200 && tokenReq.status < 400) {
            let response = JSON.parse(tokenReq.responseText); // parse response
            // console.log(response);
            let obj = response;
            key = obj.access_token; // declare and pull key from response
            token = key;
            // console.log(token);
            return token;

        }

        else {
            console.log("Error");
        }
    });
}
// the standard fetch function for retrieve data from the wsb subreddit
let redditRetrieve = function(token) {
    let postIds = [];

    if (token) {
        let url = 'https://oauth.reddit.com/r/wallstreetbets/hot'; // url variable used to fetch wsb subreddit
        let data ={
            name: userName,
            id: password
        };
        let otherPram={ // headers and method clarified for fetch call
            method: "GET",
            headers:{
                "Content-Type":"application/json",
                'Authorization': 'bearer ' + token,
                'User-Agent': 'rwar'
            },
        };
        fetch(url, otherPram) // fetching and parsing fetch response
            .then(function (response) {
                if (response.ok) {
                    response.json().then(function(data)
                    { // cycle through post data received from reddit to obtain the post ids of the posts in HOT

                        // for loop that finds the post id for posts in 'hot' on the wallstreetbets subreddit
                        for (let i = 0; i < data.data.children.length; i++) {
                            let postUrl = data.data.children[i].data.id
                            postIds.push(postUrl);
                            if (postIds.length > 10) {
                                // stop after 10 post IDs
                                return postIds;
                            }

                            // cycle through the post IDs creating a new fetch url for each post
                            for (let x = 0; x < postIds.length; x++) {
                                let newUrl = 'https://oauth.reddit.com/r/wallstreetbets/comments/' + postIds[x];
                                if (newUrl) {
                                    // fetch the post urls and cycle through to find the comments in each post
                                    fetch(newUrl, otherPram).then(function (response) {
                                        response.json().then(function(data) {
                                            for (let i = 0; i < data[1].data.children.length; i++) {
                                                let postComments = data[1].data.children[i].data.body;
                                                // send the postComments to the storeData() function

                                                storeData(postComments);
                                            }
                                        })
                                    })
                                }
                            }
                        }

                    })
                }
            })

    }
}
// the store function for pulling comment and post data from the wsb subreddit
let storeData = function(data) {
    let commentData = commentArr;
    let hotArr = [];
    // create empty arrays to store json response and individual comments from posts
    hotArr.push(data);
    let savedSearches = localStorage.getItem("stockTickers");
    savedSearches = JSON.parse(savedSearches);

    if (commentData.length <= 1000) {

            for (let i = 0; i < hotArr.length; i++) {
                // push each comment into the commentData array
                commentData.push(hotArr[i]);

                if (commentData.length >= 1000) {
                    // if the fetch pulls over 1000 comments stop adding new comments and call the sortData() function
                    sortData(commentData);
                    break;
                    }
                }
            }
    
}

let sortData = function(comments) {
    let commentData = commentArr;
    // create new empty variables and arrays for userInput and Data splitting
    let result;
    let recentSearch = [];
    let splitData = [];
    // retrieve recently searched tickers from local storage
    let savedSearches = localStorage.getItem("stockTickers");
    savedSearches = JSON.parse(savedSearches);

    for (i = 0; i < savedSearches.length; i++)
    {
        recentSearch.push(savedSearches[i].ticker);
        // push tickers from local storage to new array
    for (j = 0; j < comments.length; j++)
    {   
        if (!recentSearch[i] || !comments[j]) {
            // if the fetch failed to retrieve comments try again
            redditRetrieve(token);
            return;
        }
        // check to see if any of the comments from reddit contain the ticker the user is looking for
        comments[j].includes(recentSearch[i]) ? (splitData.push(comments[j])): "";
        let result = splitData
        // if they do then call the getSentiment() function with the result (array of comments containing ticker data)
        if (comments[j].includes(recentSearch[i])) {
            getSentiment(result);
        }
        else if (splitData.length >= 10) {
            return result;
        }
                
    }
    }
    
}

let getSentiment = function(data) {
    // create an empty string that will become sentiment value
    let getSen = "";

    for (i = 0; i < data.length; i++) {
        // create variable called indStr for each individual string data holds
        let indStr = data[i];
        // check if the strings contain keywords that would infer the response is positive
        if (indStr.includes("buy" || "huge" || "moon" || "big" || "green" || "returns" || "bullish" || "bulls" || "🚀")) {
            getSen = "BUY";
        }
        else {
        // if they do not contain those keywords the sentiment is negative
            getSen = "SELL";
        }
        console.log(getSen);
        // call the createWsbSentiment in script.js with this data
        createWsbSentiment(getSen);
        return getSen;
    }

}

getToken(tokenUrl, userName, password);