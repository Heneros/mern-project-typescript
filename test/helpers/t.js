// const maskCreditCard = function (number) {
//     const str = number + '';
//     const last = str.slice(-4);
//     return last.padStart(str.length, '*');
// };
// console.log(maskCreditCard(45345345435)); ////*******5435
// console.log(maskCreditCard(1223324324324)); ///*********4324
var maskCreditCard = function (number) {
    var str = number + '';
    var last = str.slice(-4);
    return last.padStart(str.length, '*');
};
console.log(maskCreditCard(45345345435));
