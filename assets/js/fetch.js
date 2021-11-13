// fetch the wallstreet bets api
var token
var userName = "upojT-rxULWxHaohV2favg"; // app client ID
var password = "MUqZZ5kKtbug12ThYb5lUqZmFeg4YA"; // app clientSecret
var tokenUrl = "https://www.reddit.com/api/v1/access_token"; // application token endpoint
let tokenReq = new XMLHttpRequest();

function getToken(url, clientID, secret) {
    var key;
    tokenReq.open("POST", url, true)
    tokenReq.setRequestHeader("Authorization", "Basic " + btoa(clientID + ":" + secret));
    tokenReq.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
    tokenReq.send("grant_type=client_credentials&client_id="+clientID+"&"+"client_secret="+secret);
    tokenReq.addEventListener ("load", function(){
        if (tokenReq.status >= 200 && tokenReq.status < 400) {
            let response = JSON.parse(tokenReq.responseText);
            console.log(response);
            let obj = response;
            key = obj.access_token;
            token = key;
            console.log(token);
        }

        else {
            console.log("Network Error");
        }
    });
}


let redditRetrieve = function() {
    getToken(tokenUrl, userName, password);
    
    fetch("https://www.reddit.com/api/v1/me").then(function(response) {
        console.log(response);
    })
}

redditRetrieve();