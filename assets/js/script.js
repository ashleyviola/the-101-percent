let stockSearchEl = document.querySelector("#stock-search-form");
let stockNameInputEl = document.querySelector("#stock-call-sign");
let searchHistoryEl = document.querySelector("#search-history");
let modalEl = document.querySelector(".modal");
let modalExitBtn = document.querySelector("close");
let recentSearches = [];

// call API information
let getStockTickerData = function(stockName){
    apiKey = "XY2QN2G7T7ZHKP88"
    var apiUrl = "https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol="+ stockName + "&apikey=" + apiKey;

    fetch(apiUrl)
    .then(function(response){
        if(response.ok){
            response.json().then(function(data){
                console.log(data);
            });
        } 
    });
};

// Search Input Handler 
let formSubmitHandler = function(event){
    event.preventDefault();
   
    let stockCallNameInput = stockNameInputEl.value.trim();

    var recentSearchObj = {
        ticker: stockCallNameInput 
    };
    
    if(!stockCallNameInput){
        displayModalHandler();
        return false;
    }
    if (recentSearches.length > 0){

        // while (recentSearches.ticker === stockCallNameInput){
        //     console.log(recentSearches.ticker.value);
        //     console.log("this ticker has already been searched");
        //     console.log(recentSearchObj);
        //     getStockTickerData(stockCallNameInput);
        // }
        // console.log("this hasn't been searched yet");
        // console.log(recentSearchObj);
        // createRecentSearchBtns(recentSearchObj);

        for  (let i = 0; i < recentSearches.length; i++){
            if(recentSearches[i] === stockCallNameInput){
                console.log(recentSearches[i].ticker.value);
                console.log("this ticker has already been searched");
                console.log(recentSearchObj);
                getStockTickerData(stockCallNameInput);    
            } else if (recentSearches[i].ticker != stockCallNameInput){
                console.log("this hasn't been searched yet");
                console.log(recentSearchObj);
                createRecentSearchBtns(recentSearchObj);
                break;
            } 
        }
         
    } else {
            console.log("there are no previous saved searches. this is the first search.");
            console.log(recentSearchObj);
            getStockTickerData(stockCallNameInput);
            createRecentSearchBtns(recentSearchObj);
            
    }

    stockNameInputEl.value = "";

    console.log(recentSearches);
};


// dynamically create recent search buttons 
let createRecentSearchBtns = function(recentSearchObj){
    // creating button element 
    var savedListItemEl = document.createElement("li");
    savedListItemEl.className = "saved-item";
    savedListItemEl.addEventListener("click", function(){
        console.log("click");
        console.log(recentSearchObj.ticker);
        getStockTickerData(recentSearchObj.ticker);

    });

    var savedTickerBtnEl = document.createElement("button");
    savedTickerBtnEl.className = "saved-ticker-btn";
    savedTickerBtnEl.innerHTML = "<p class='ticker-name'>" + recentSearchObj.ticker + "</p>";

    savedListItemEl.appendChild(savedTickerBtnEl);
    searchHistoryEl.appendChild(savedListItemEl);
    
    recentSearches.push(recentSearchObj);

    saveSearchInput();
};

// save search input to localstorage 
let saveSearchInput = function(){
    localStorage.setItem("stockTickers", JSON.stringify(recentSearches));
}

// load past searches 
let loadSearches = function(){
    let savedSearches = localStorage.getItem("stockTickers");
    if(!savedSearches){
        return false;
    }
    console.log("saved tasks found!")
    
    savedSearches = JSON.parse(savedSearches);
    console.log(savedSearches);
    for (let i = 0; i < savedSearches.length; i++){
    createRecentSearchBtns(savedSearches[i]);
    }
}

// modal functions 
let displayModalHandler = function(){
    modalEl.style.display = "block";
};
let exitModalHandler = function(){
    modalEl.style.display = "none";
};

// Event Listeners 
stockSearchEl.addEventListener("submit",formSubmitHandler);
modalEl.addEventListener("click",exitModalHandler);

// on load functions 
loadSearches();