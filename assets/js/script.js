let stockSearchEl = document.querySelector("#stock-search-form");
let stockNameInputEl = document.querySelector("#stock-call-sign");
let searchHistoryEl = document.querySelector("#search-history");
let modalEl = document.querySelector(".modal");
let modalExitBtn = document.querySelector("close");
let recentSearchCounter = [];
let recentSearches = [];

// Search Input Handler 
let formSubmitHandler = function(event){
    event.preventDefault();
    let stockCallNameInput = stockNameInputEl.value.trim();
   
    // check if inputs are empty
    if(!stockCallNameInput){
        displayModalHandler();
        return false;
    }
    // NEED TO ADD VALIDATION OF TICKER VALUE FROM API 

    stockNameInputEl.value = ""

    // check if this is a new search or previous 

    var pastSearch = stockSearchEl.hasAttribute("search-id");
    if (pastSearch){
        // var searchId = stockSearchEl.getAttribute("search-id");
        // console.log("this has been previously searched");
    } else {
        var recentSearchObj = {
            ticker: stockCallNameInput 
        };
        console.log(recentSearchObj)
        createRecentSearchBtns(recentSearchObj)
    }

};

let createRecentSearchBtns = function(recentSearchObj){
    // creating button element 
    var savedListItemEl = document.createElement("li");
    savedListItemEl.className = "saved-item";
    savedListItemEl.setAttribute("search-id", recentSearchCounter);

    var savedTickerBtnEl = document.createElement("button");
    savedTickerBtnEl.className = "saved-ticker-btn";
    savedTickerBtnEl.innerHTML = "<p class='ticker-name'>" + recentSearchObj.ticker + "</p>";

    savedListItemEl.appendChild(savedTickerBtnEl);
    searchHistoryEl.appendChild(savedListItemEl);
    // save task as an object with name and id 
    recentSearchObj.id = recentSearchCounter;

    recentSearches.push(recentSearchObj);

    // save tasks to localStorage
    saveSearchInput();
    
    // increase task counter for next task id 
    recentSearchCounter++;
}

// save search input to localstorage 
let saveSearchInput = function(){
    localStorage.setItem("stockTickers", JSON.stringify(recentSearches));
}

let loadSearches = function(){
    let savedSearches = localStorage.getItem("stockTickers");
    if(!savedSearches){
        return false;
    }
    console.log("saved tasks found!")
    
    savedSearches = JSON.parse(savedSearches);
    console.log(savedSearches);
//     for (let i = 0; i < savedSearches.length; i++){
//         createRecentSearchBtns(savedSearches[i]);
//     }
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

loadSearches();