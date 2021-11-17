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
            redditRetrieve(token);
            return token;
        }

        else {
            console.log("Network Error");
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
                    {
                        // console.log(data.data.children[0].data.id)
                        // for loop that finds the post id for posts in 'hot' on the wallstreetbets subreddit
                        for (let i = 0; i < data.data.children.length; i++) {
                            let postUrl = data.data.children[i].data.id
                            postIds.push(postUrl);
                            if (postIds.length > 10) {
                                return postIds;
                            }
                            // console.log(postIds);

                            for (let x = 0; x < postIds.length; x++) {
                                let newUrl = 'https://oauth.reddit.com/r/wallstreetbets/comments/' + postIds[x];
                                if (newUrl) {
                                    fetch(newUrl, otherPram).then(function (response) {
                                        response.json().then(function(data) {
                                            // console.log(data[1].data.children[1].data.body);
                                            for (let i = 0; i < data[1].data.children.length; i++) {
                                                let postComments = data[1].data.children[i].data.body;
                                                if (i === 1000) { break; }
                                                // console.log("HELLO");
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

    if (commentData.length <= 500) {

            for (let i = 0; i < hotArr.length; i++) {
                commentData.push(hotArr[i]);

                if (commentData.length >= 500) {
                    sortData(commentData);
                    break;
                    }
                }
            }
    
}

let sortData = function(comments) {

    let result;
    let recentSearch = [];
    let splitData = [];
    let savedSearches = localStorage.getItem("stockTickers");
    savedSearches = JSON.parse(savedSearches);

    for (i = 0; i < savedSearches.length; i++)
    {
        recentSearch.push(savedSearches[i].ticker);
    for (j = 0; j < comments.length; j++)
    {   
        if (!recentSearch[i] || !comments[j]) {
            storeData(commentData);
        }
        comments[j].includes(recentSearch[i]) ? (splitData.push(comments[j])): "";
        let result = splitData

        if (comments[j].includes(recentSearch[i])) {
            console.log(splitData);
        }
        else if (splitData.length >= 10) {
            getSentiment(splitData);
            return result;
        }
                
    }
    }
    
}

let getSentiment = function(data) {
    let getSen = 0;

    for (i = 0; i < data.length; i++) {
        let indStr = data[i];
        if (indStr.includes("buy" || "huge" || "moon" || "big" || "green" || "returns" || "bullish" || "bulls" || "🚀")) {
            getSen = 1;
        }
        else {
            getSen = 0;
        }
        console.log(getSen);
        return getSen;
    }
}

getToken(tokenUrl, userName, password);