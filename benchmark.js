// BENCHMARK JSONParse vs JSON.parse method
const JSONParse = require("./src/JSONParse");

function getInputString() {
  return `
{
  "str": "My_String${Math.random()}",
  "ranges": [
    "${Math.random()}",
    "${Math.random()}",
    "${Math.random()}",
    "${Math.random()}",
    "${Math.random()}",
    "${Math.random()}",
    "${Math.random()}"
   ]
}`;
}
var result;

var count = 10000;

/**
 * JSON.parse
 */
var now = Date.now();

for (var i = 0; i < count; i++) {
  result = JSON.parse(getInputString());
}

var end = Date.now();

var ms = end - now;
var avg = ms / count;
var nativeAvg = avg;

console.log(`
  === JSON.parse ===
  TOTAL EXECUTION TIME: ${ms}ms
  AVERAGE ITERATION TIME: ${avg}ms
  ITERATIONS: ${count}
`);

/**
 * JSONParse
 */
now = Date.now();

for (var i = 0; i < count; i++) {
  result = JSONParse(getInputString());
}

end = Date.now();

ms = end - now;
avg = ms / count;

console.log(`
  === JSONParse ===
  TOTAL EXECUTION TIME: ${ms}ms
  AVERAGE ITERATION TIME: ${avg}ms
  ITERATIONS: ${count}
`);

/**
 * Compare results
 */

var times_faster = Math.floor(avg / nativeAvg);
var percent_faster = Math.floor(((avg - nativeAvg) / avg) * 100.0);

console.log(`
  === RESULTS ===
  JSON.parse is ${times_faster}x times faster than JSONParse
  JSON.parse is ${percent_faster}% percent faster than JSONParse

`);
