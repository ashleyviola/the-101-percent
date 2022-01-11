// create loads of emptyy arrays to shrink/seperate data and assist in potentially training algo
let arr = [];
let smallArr = [];
let arrObj = [];
let arrLess = [];
let arrMore = [];
let refinedArr = [];
let trainPosArr = [];
let trainNegArr = [];
// baseline sentiment value to be assigned to word objects in data received
const senVal = {
    positive: 1,
    negative: -1,
    ticker: ""
};
// creates empty pos and neg values as well as a series of words with pos or neg connatations attached
let p = 0;
let n = 0;
const pos = {"green":true, "up":true, "buy":true, "sold":true, "chicken":true, "nuggies":true, "huge":true, "love:":true,
"big":true, "large":true, "massive":true, "calls":true, "sweet":true, "cool":true, "nice":true, "daddy":true, "returns":true};

const neg = {"red":true, "down":true, "sell":true, "tits":true, "fucked":true, "hate":true, "bullshit":true, "sucks":true, "fuck":true, "retarded":true,
"pissed":true, "dead":true, "broke":true, "plummet":true, "plummeting":true, "crashing":true};

const negation = {"not":true, "none":true};

const intense = {"so":true, "very":true, "extremely":true, "too":true};

const stocks = {"TSLA":true, "AAPL":true, "AMZN":true, "RIVN":true};
console.log(stocks)

// calculate an average sentiment based on words received compared to words in objects above
// this DOESN'T calculate a sentiment based on the stock inputted, this is just a baseline analyzer for all comment data,
// the data usually hovers around 50/50 pos/neg and the avg shows that as well
let overtSen = function(array) {
    for (i = 0; i < array.length; i++) {
        // console.log(array[i]);
        if(array[i].key in negation) {
            let c=0;
            let d=0;
            let currentPos=i;
            do 
            {
                c++;
                d++;
                currentPos++;
                if(array[currentPos].key in pos && c<4 )
                {array[i].score = 1;
                    n++; break}
                else if(array[currentPos].key in neg && d<4 )
                {array[i].score = -1;
                    p++; break}
                }while(c<4||d<4);


            }
            else if(array[i].key in intense)
            {
            if(array[i+1].key in pos)
            {array[i].score = 1;
                p=p+2;}
            }
            if(array[i].key in stocks)
            {array[i].stock = "yes"}
            else if(array[i].key in pos)
            {array[i].score = 1;
                p++;}
            else if(array[i].key in neg)
            {array[i].score = -1;
                n++;}
            else {
            array[i].score = 0;
            }
            }
            console.log((p/(p+n))*100);
            console.log((n/(p+n))*100);
            // console.log(array);
            let total = 0;
            for(let i = 0; i < array.length; i++) {
                total += array[i].score;
            }
            let avg = total / array.length
            console.log(avg);
            // trainFunc(array);
}

// remove all symbols from words in the data
let shrinkData = function(array) {
    array.forEach(item => {
        let small = item.replace(/[^a-zA-Z0-9🚀 ]/g, "");
        
        smallArr.push(small);
        return smallArr;
    })
}