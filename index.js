// Example usage
const JSONParse = require("./src/JSONParse");

var inputString = `
{
  "firstName": "John",
  "lastName": "Doe",
  "age": 19,
  "notifications": [],
  "status": {
    "online": false,
    "snooze": true
  }
}
`;

console.log(JSONParse(inputString));
