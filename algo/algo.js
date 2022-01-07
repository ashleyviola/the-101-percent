class analyzer {
    constructor() {
    analyzerModel = {},
    this.weights = [{}],
    this.bias = 0

analyzerModel.predict = function (arr) {

    let testScore = 0;
    for (let i = 0; i < weights.length; i++) {
        testScore += weights[i] * arr[i].score
        console.log(arr[i].score);
    }
    testScore += bias;
    // console.log(testScore);
    return testScore > 0 ? 1 : -1;
    // console.log(result)
};

analyzerModel.train = function (arr, score) {

    if (arr.length !== weights.length) {
        weights = arr
        bias = 0
    }

    let prediction = analyzerModel.predict(arr, score);
    // console.log(prediction);
    if (prediction !== score) {
        let gradient = score - prediction;
        for (let i = 0; i < weights.length; i++) {
            weights[i] += gradient * arr[i];
        }
        bias += gradient;
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
}