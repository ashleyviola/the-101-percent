let commentArr = [];
let posSen = 0;
let negSen = 0;
var sentiment;

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

    if (commentData.length <= 3000) {

            for (let i = 0; i < hotArr.length; i++) {
                // push each comment into the commentData array
                commentData.push(hotArr[i]);

                if (commentData.length >= 3000) {
                    // if the fetch pulls over 1000 comments stop adding new comments and call the sortData() function
                    sortData(commentData);
                    break;
                    }
                }
            }
    
}

let sortData = function(comments) {
    let splitData = [];
    comments.map((item, index, arr) => {
        if (!arr[index +1] && index < arr.length-1) arr[index+1] = "empty"; {
        }
        if (item.includes(ticker)) {
            splitData.push(item);
        }
      
    });
    getSentiment(splitData);
}

let getSentiment = function(data) {

    data.forEach(item => {
        // check if the strings contain keywords that would infer the response is positive
        if (item.includes("buy" || "huge" || "moon" || "big" || "green" || "returns" || "bullish" || "bulls" || "🚀" || "pump")) {
            posSen++;
            console.log(item);
        }
        if (item.includes("sell" || "candles" || "small" || "loss" || "bad" || "red" || "lose" || "sold" || "bear" || "bearish")) {
            negSen--;
            console.log(item);
        }
    });

    if (posSen >= negSen) {
        sentiment = "BUY"
    }
    if (negSen >= posSen) {
        sentiment = "SELL"
    }
    if (negSen === 0 && posSen === 0) {
        sentiment = "WALLSTREETBETS DOESN'T CARE ABOUT THIS STOCK"
    }
    createWsbSentiment(sentiment);
}

getToken(tokenUrl, userName, password);

stockSearchEl.addEventListener("submit",getToken(tokenUrl, userName, password), function() {
    posSen = 0;
    negSen = 0;
    redditRetrieve();
});