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
            console.log(response);
            let obj = response;
            key = obj.access_token; // declare and pull key from response
            token = key;
            console.log(token);
            redditRetrieve(token);
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
                        // for loop that finds the post id for posts in 'hot' on the wallstreetbets subreddit
                        for (let i = 0; i < data.data.children.length; i++) {
                            let postUrl = data.data.children[i].data.id
                            postIds.push(postUrl);

                            let newUrl = 'https://oauth.reddit.com/r/wallstreetbets/comments/' + postUrl;
                                if (newUrl) {
                                    fetch(newUrl, otherPram).then(function (response) {
                                        response.json().then(function(data) {
                                            console.log(data[1].data.children[1].data.body);
                                            for (let i = 0; i < data[1].data.children.length; i++) {
                                                let postComments = data[1].data.children[i].data.body;
                                                // console.log(postComments);
                                                storeData(postComments);
                                            }
                                        })
                                    })
                                }
                        }
                        
                    })
                }
            })

    }
}
// the store function for pulling comment and post data from the wsb subreddit
let storeData = function(data) {
    // create empty arrays to store json response and individual comments from posts
    let commentData = [];
    let hotArr = [];
    let newArr = hotArr.push(data);

    let wsbComments = hotArr[0];
    
    for (let i = 0; i < wsbComments.length; i++) {
            commentData.push(wsbComments);
            
    }
    return commentData;
}

let sortData = function() {

}

getToken(tokenUrl, userName, password);