// Example usage
const JSONParse = require("./src/JSONParse");

var inputString = '{"key":{},,}';

console.log(JSONParse(inputString));
console.log(JSON.parse(inputString));
