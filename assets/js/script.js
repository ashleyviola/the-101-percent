let stockSearchEl = document.querySelector("#stock-search-form");
let stockNameInputEl = document.querySelector("#stock-call-sign");
let modalEl = document.querySelector(".modal");
let modalExitBtn = document.querySelector("close");


// Search Input Handler 
let formSubmitHandler = function(event){
    event.preventDefault();

    let stockCallName = stockNameInputEl.value.trim();
    if (stockCallName){
        // add condition to have it check stvio for stock ticker to make sure that it's valid 
        if(stockCallName.length < 6){
            console.log(stockCallName);
            // enter fetch functions here 
        } else {
            displayModalHandler();
        }
    } else { 
        displayModalHandler();
    }
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