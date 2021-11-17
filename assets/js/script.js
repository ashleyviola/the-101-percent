// global variables 
let stockSearchEl = document.querySelector("#stock-search-form");
let stockNameInputEl = document.querySelector("#stock-call-sign");
let searchHistoryEl = document.querySelector("#search-history");
let modalEl = document.querySelector(".modal");
let modalExitBtn = document.querySelector("close");

// array that holds searched ticker symbols
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
    })
    // .catch(err => {
    //     err.text().then(displayModalHandler);
    // })
};

// Search Input Handler 
let formSubmitHandler = function(event){
    event.preventDefault();
   
    let stockCallNameInput = stockNameInputEl.value.trim();

    // saves recent search to the array 
    var recentSearchObj = {
        ticker: stockCallNameInput 
    };
    
    // calls modal if nothing is entered
    if(!stockCallNameInput){
        displayModalHandler();
        return false;
    }
    
    // checks if there are existing searches. if there are,
    // checks if this is a new search value or duplicate 
    if (recentSearches.length > 0){
        $('#search-history').each(function(){
            // if it isn't a new value calls data without creating button
            if($(".saved-ticker-btn").hasClass(stockCallNameInput)){
                console.log("this ticker has already been searched");
                getStockTickerData(stockCallNameInput);

            // if it is a new value calls data and creates button 
            } else {
                console.log("this hasn't been searched yet");
                createRecentSearchBtns(recentSearchObj);
                getStockTickerData(stockCallNameInput);
            }
        })
    // if this is the first value calls data and creates button 
    } else {
            console.log("there are no previous saved searches. this is the first search.");
            console.log(recentSearchObj);
            getStockTickerData(stockCallNameInput);
            createRecentSearchBtns(recentSearchObj);
            
    }
    
    // clears search field 
    stockNameInputEl.value = "";

    console.log(recentSearches);
    return recentSearches

};


// dynamically create recent search buttons 
let createRecentSearchBtns = function(recentSearchObj){
    // creating button element 
    var savedListItemEl = document.createElement("li");
    savedListItemEl.className = "saved-item" ;
    savedListItemEl.addEventListener("click", function(){
        console.log("click");
        console.log(recentSearchObj.ticker);
        getStockTickerData(recentSearchObj.ticker);

    });

    var savedTickerBtnEl = document.createElement("button");
    savedTickerBtnEl.className = "saved-ticker-btn "+recentSearchObj.ticker;
    savedTickerBtnEl.innerHTML = "<p class='ticker-name'>" + recentSearchObj.ticker + "</p>";
    console.log(savedTickerBtnEl);
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
    return savedSearches;
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