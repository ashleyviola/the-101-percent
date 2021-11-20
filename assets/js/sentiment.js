
let arr = [];
let smallArr = [];
let arrObj = [];
let arrLess = [];
let arrMore = [];
let refinedArr = [];
let trainPosArr = [];
let trainNegArr = [];

const senVal = {
    positive: 1,
    negative: -1,
    ticker: ""
};
let p = 0;
let n = 0;
const pos = {"green":true, "up":true, "buy":true, "sold":true, "chicken":true, "nuggies":true, "huge":true, "love:":true,
"big":true, "large":true, "massive":true, "calls":true, "sweet":true, "cool":true, "nice":true, "daddy":true, "returns":true};
console.log(pos);

const neg = {"red":true, "down":true, "sell":true, "tits":true, "fucked":true, "hate":true, "bullshit":true, "sucks":true, "fuck":true, "retarded":true,
"pissed":true, "dead":true, "broke":true, "plummet":true, "plummeting":true, "crashing":true};

const negation = {"not":true, "none":true};

const intense = {"so":true, "very":true, "extremely":true, "too":true};

const stocks = {"TSLA":true, "AAPL":true, "AMZN":true, "RIVN":true};

let analysis = function(array) {
    for (i = 0; i<array.length; i++) {
        if(array[i].key in negation) {
            console.log(array[i].key)
            let c=0;
            let d=0;
            let currentPos=i;
            do
            {
                c++;
                d++;
                currentPos++;
                if(array[currentPos].key in pos && c<4 )
                {n++; break}
                else if(array[currentPos].key in neg && d<4 )
                {p++; break}
                }while(c<4||d<4);


            }//negation over
            else if(array[i].key in intense)
            {
            if(array[i+1].key in pos)
            {p=p+2;}
            }// intense
            else if(array[i].key in pos)
            {p++;}
            else if(array[i].key in neg)
            {n++;}
            }//for over
            console.log((p/(p+n))*100);
            console.log((n/(p+n))*100);
}

let parseData = function(data) {
    data.forEach(item => {
        let parsed = item.split(" ");

        parsed.forEach(element => {
            arr.push(element);
            return arr;
        })
    })
    shrinkData(arr);
}

let shrinkData = function(array) {
    array.forEach(item => {
        let small = item.replace(/[^a-zA-Z0-9🚀 ]/g, "");
        
        smallArr.push(small);
        return smallArr;
    })

createObjects(smallArr);
}

let createObjects = function(array) {
    for (i = 0; i < array.length; i++) {
        arrObj.push({
            key: array[i],
            id: i++,
            score: 0,
            stock: 0
        })
            
    }
    for (i = 0; i < arrObj.length; i++) {
        if (arrObj[i].key.length < 3) {
            arrLess.push(arrObj[i]);
        }
        else if (arrObj[i].key.length > 12) {
            arrMore.push(arrObj[i]);
        }
    }
    console.log(array[0].key)
    analysis(arrObj);
    return arrObj;
}

let trainFunc = function(arr) {
    // console.log(arr);

    let a = analyzer();
    a.train(arr, 1);
    a.train(arr, -1);
    a.train(arr, 0);
    a.predict(arr);
    console.log(a.bias(arr, 1));
    console.log(a.bias(arr, -1));
    console.log(a.bias(arr, 1));
    console.log(a.predict(arr))
}


function analyzer() {
    let analyzerModel = {},
    weights = [];
    bias = 0;

analyzerModel.predict = function (arr) {

    let testScore = 0;
    for (let i = 0; i < weights.length; i++) {
        testScore += weights[i] * arr[i].score
        // console.log(arr[i].score);
    }
    testScore += bias;
    // console.log(testScore);
    return testScore > 0 ? 1 : 0;
    // console.log(result)
};

analyzerModel.train = function (arr, score) {

    // if (score !== 0 && score !== 1) return null;

    if (arr.length !== weights.length) {
        weights = arr
        bias = 0
        // console.log(weights);
    }

    let prediction = analyzerModel.predict(arr, score);
    // console.log(prediction);
    if (prediction !== score) {
        let gradient = score - prediction;
        for (let i = 0; i < weights.length; i++) {
            weights[i] += gradient * arr[i];
        }
        bias += gradient;
        // console.log(bias);
        // console.log(prediction);
    }
    return analyzerModel;
};

 analyzerModel.weights = function() {
    return weights;
};


analyzerModel.bias = function() {
    return bias;
};

console.log(analyzerModel);
return analyzerModel;
}