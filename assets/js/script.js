// global variables 
let stockSearchEl = document.querySelector("#stock-search-form");
let stockNameInputEl = document.querySelector("#stock-call-sign");
let searchHistoryEl = document.querySelector("#search-history");
let stockInfoEl = document.querySelector("#called-stock-container");
let modalEl = document.querySelector(".modal");
let wallStreetBetEl = document.querySelector("#wsb");
let errorModelEl = document.querySelector(".errorModal");
let modalExitBtn = document.querySelector("close");

let ticker

// alphavantage apiKey
apiKey = "XY2QN2G7T7ZHKP88"
// array that holds searched ticker symbols
let recentSearches = [];

// call API information
let getStockData = function(stockName){
    let priceApiUrl = "https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol="+ stockName + "&apikey=" + apiKey;
    let overviewDataApiUrl = "https://www.alphavantage.co/query?function=OVERVIEW&symbol="+ stockName +"&apikey=" + apiKey;
    
    Promise.all([
        fetch(priceApiUrl),
        fetch(overviewDataApiUrl)
    ]).then(function(response){
        return Promise.all(response.map(function(response){
            return response.json();
        }));
    }).then(function(data){
        createStockInfo(data, stockName);
    });
    ticker = stockName;
    return ticker;

};

// Search Input Handler 
let formSubmitHandler = function(event){
    event.preventDefault();
   
    let stockCallNameInput = stockNameInputEl.value.trim();

    document.getElementById("called-stock-container").style.display="block";

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

                getStockData(stockCallNameInput);
                redditRetrieve(token);

            // if it is a new value calls data and creates button 
            } else {
                console.log("this hasn't been searched yet");
                createRecentSearchBtns(recentSearchObj);

                getStockData(stockCallNameInput);
                redditRetrieve(token);
            }
        })
    // if this is the first value calls data and creates button 
    } else {
            console.log("there are no previous saved searches. this is the first search.");
            console.log(recentSearchObj);

            getStockData(stockCallNameInput);
            createRecentSearchBtns(recentSearchObj);
            redditRetrieve(token);
            
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
        
        redditRetrieve(token);
        getStockData(recentSearchObj.ticker);
        document.getElementById("called-stock-container").style.display="block";
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

// creates sentiment from Reddit 
let createWsbSentiment = function(sentiment){

    let senText = document.querySelector("#sentiment");
    let randText = "";

    let fillerText = ["WallstreetBets Says ",
    "The Degenerates Say ",
    "Reddit Says ",
    "The Internet Gamblers Have SPOKEN: "];

    for (i = 0; i < fillerText.length; i++) {
        let chooseText = "";
        randText = (Math.floor(Math.random() * 10));

        if (randText <= 2) {
            (chooseText = fillerText[0])
            senText.value = (chooseText += sentiment);
        }
        else if (randText <= 4) {
            chooseText = fillerText[1]
            senText.value = (chooseText += sentiment);
        }
        else if (randText >= 6) {
            chooseText = fillerText[2]
            senText.value = (chooseText += sentiment);
        }
        else {
            chooseText = fillerText[3];
            senText.value = (chooseText += sentiment);
        }
        return chooseText;
    }
};


// create stock information 
let createStockInfo = function(currentData, tickerSymbol){
    console.log(currentData);
    console.log(tickerSymbol);
    stockInfoEl.textContent = "";

    let friday = moment().day(5-7).format('YYYY-MM-DD');
        console.log("friday " + friday);
        console.log("today" + moment().day());

    let yesterday = moment().subtract(1, 'day').format('YYYY-MM-DD');
        console.log("yesterday " + yesterday);

    let todaysDate = moment().format('YYYY-MM-DD');
    console.log("today " + todaysDate);
    console.log("today" + moment().day());

    //create stock-ticker symbol 
    let stockTickerSymbol = document.createElement("h2");
    stockTickerSymbol.textContent = tickerSymbol;
    stockTickerSymbol.id = "ticker-symbol";
    stockInfoEl.appendChild(stockTickerSymbol);

    let stockContentEl = document.createElement("div");
    stockContentEl.className = "stock-content-overview";
    stockInfoEl.appendChild(stockContentEl);

    // create stock overview div container 
    let stockOverviewEl = document.createElement("div");
    stockOverviewEl.className = "stock-overview"
    stockContentEl.appendChild(stockOverviewEl);

    //create stock name 
    let stockName = document.createElement("h3");
    stockName.textContent = currentData[1].Name + " ";
    stockName.id = "stock-name";
    stockOverviewEl.appendChild(stockName);

    // create stock sector 
    let stockSector = document.createElement("h4");
    stockSector.textContent = currentData[1].Sector;
    stockSector.id = "stock-sector";
    stockOverviewEl.appendChild(stockSector);

    // create stock description 
    let stockDescription = document.createElement("p");
    stockDescription.textContent = currentData[1].Description;
    stockDescription.id = "stock-description";
    stockOverviewEl.appendChild(stockDescription);

    // create stock pricing div container 
    let stockPricingEl = document.createElement("div");
    stockPricingEl.className = "stock-pricing";
    stockContentEl.appendChild(stockPricingEl);

    // create today's date 
    let todaysDateEl = document.createElement("h3");
    if (moment().day(6) || moment().day(7)){
        todaysDateEl.textContent = moment().day(5-7).format("dddd, MMMM D");
    } else if (moment().day(1) || moment().day(2) || moment().day(3) || moment().day(4) || moment().day(5)){}
        if (moment().isBefore(17, 'hour')){
            todaysDateEl.textContent = moment().subtract(1, 'day').format("dddd, MMMM D");
        } else {
            todaysDateEl.textContent = moment().format("dddd, MMMM D");
        }

    stockPricingEl.appendChild(todaysDateEl);

    // create stock open price information 
    let openStockPricingValue = document.createElement("p");
    openStockPricingValue.textContent = "Value at Market Open | "
    openStockPricingValue.id = "stock-open-value";
    stockPricingEl.appendChild(openStockPricingValue);
    let openStockPricing = document.createElement("span");
    openStockPricing.id = "stock-open";
    openStockPricingValue.appendChild(openStockPricing);
    openStockPricing.id = "stock-open";
    openStockPricingValue.appendChild(openStockPricing);

    // create stock close price information 
    let closeStockPricingValue = document.createElement("p");
    closeStockPricingValue.textContent = "Value at Market Close | "
    closeStockPricingValue.id = "stock-close-value";
    stockPricingEl.appendChild(closeStockPricingValue);
    let closeStockPricing = document.createElement("span");
    closeStockPricing.id = "stock-close";
    closeStockPricingValue.appendChild(closeStockPricing);

    // create stock high price information 
    let highStockPricingValue = document.createElement("p");
    highStockPricingValue.textContent = "High | "
    highStockPricingValue.id = "stock-close-value";
    stockPricingEl.appendChild(highStockPricingValue);
    let highStockPricing = document.createElement("span");
    highStockPricing.id = "stock-open";
    highStockPricingValue.appendChild(highStockPricing);

     // create stock low price information 
     let lowStockPricingValue = document.createElement("p");
     lowStockPricingValue.textContent = "Low | "
     lowStockPricingValue.id = "stock-close-value";
     stockPricingEl.appendChild(lowStockPricingValue);
     let lowStockPricing = document.createElement("span");
     lowStockPricing.id = "stock-open";
     lowStockPricingValue.appendChild(lowStockPricing);
    
    if (moment().day(1) || moment().day(2) || moment().day(3) || moment().day(4) || moment().day(5)){
        if (moment().isBefore(17, 'hour')){
            console.log("it's a weekday before 5pm");
            openStockPricing.textContent = "$" + currentData[0]["Time Series (Daily)"][yesterday]["1. open"];
            closeStockPricing.textContent = "$" + currentData[0]["Time Series (Daily)"][yesterday]["4. close"];
            highStockPricing.textContent = "$" + currentData[0]["Time Series (Daily)"][yesterday]["2. high"];
            lowStockPricing.textContent = "$" + currentData[0]["Time Series (Daily)"][yesterday]["3. low"];
        } else {
            console.log("it's a weekday after 5pm");
            openStockPricing.textContent = "$" + currentData[0]["Time Series (Daily)"][todaysDate]["1. open"];
            closeStockPricing.textContent = "$" + currentData[0]["Time Series (Daily)"][todaysDate]["4. close"];
            highStockPricing.textContent = "$" + currentData[0]["Time Series (Daily)"][todaysDate]["2. high"];
            lowStockPricing.textContent = "$" + currentData[0]["Time Series (Daily)"][todaysDate]["3. low"];
        } 

    } else if (moment().day(6) || moment().day(7)){
        console.log("it's saturday or sunday");
        openStockPricing.textContent = "$" + currentData[0]["Time Series (Daily)"][friday]["1. open"];
        closeStockPricing.textContent = "$" + currentData[0]["Time Series (Daily)"][friday]["4. close"];
        highStockPricing.textContent = "$" + currentData[0]["Time Series (Daily)"][friday]["2. high"];
        lowStockPricing.textContent = "$" + currentData[0]["Time Series (Daily)"][friday]["3. low"];
    }
};

// save search input to localstorage 
let saveSearchInput = function(){
    localStorage.setItem("stockTickers", JSON.stringify(recentSearches));
};

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
};

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
