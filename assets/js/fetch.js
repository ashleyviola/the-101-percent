var userInput = document.querySelector("#userInput");
var textInput = document.querySelector("#ticker");
var symbol = document.querySelector("tickerSymbol");

var userSubmit = function(event) {
    //prevent page from refreshing
    event.preventDefault();
}


let getStockTicker = function(userInput) {
//format api
    var apiUrl = "https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=APPL&apikey=8SSQ3UGDCDSE5MZ6";

//making a get request
    fetch(apiUrl)
    .then(function(response) {
        //request was successful
        if(response.ok) {
            console.log(response);
            response.json().then(function(data) {
            console.log(data);
            
            });
        } else {
            alert("Error, Please Enter a valid ticker." + response.statusText);
        }
    })
};



var displayStocks = function() {
    if (response[i].symbol = "APPL");
    var comments = response[i].matchScore;
    console.log(data);
}


userInput.addEventListener("submit", userSubmit);
getStockTicker();

// Sort Data Here

//check api returns
var getTickerData = function(ticker) {
    if (ticker.length === 0) {
        symbol.textContent = "No ticker found.";
        return;

    }
}

//for (var i = 0; i < ticker.length; i++) {
    
//}
