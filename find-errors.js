var JSONParse = require("./src/JSONParse");

var count = 100000;
var now = Date.now();

function getInputString(length) {
  var output = "";
  var characterSet = ['"', "{", "}", "[", "]", ":", ",", "0", "1"];
  var stack = [];

  for (var i = 0; i < length; i++) {
    var char = characterSet[Math.floor(characterSet.length * Math.random())];

    if (char == "{" || char == "[") {
      stack.push({ "{": "}", "[": "]" }[char]);
    }

    if (char == "}" || char == "]") {
      var last = stack[stack.length - 1];

      if (!last || char != last) {
        continue;
      }

      stack.pop();

      if (!stack.length) {
        break;
      }
    }

    if ((char === "0" || char === "1") && output[output.length - 1] === "0") {
      continue;
    }

    output += char;
  }

  output += stack.join("");

  return output;
}

for (var i = 0; i < count; i++) {
  var inputString = getInputString(Math.random() * 10 + 3);

  var res1, res2;
  try {
    res1 = { status: "success", data: JSONParse(inputString) };
  } catch (e) {
    res1 = { status: "error", data: e };
  }

  try {
    res2 = { status: "success", data: JSON.parse(inputString) };
  } catch (e) {
    res2 = { status: "error", data: e };
  }

  if (res1.status === res2.status) {
    console.log(res1.status, inputString, res1.data?.message);
    continue;
  }

  console.log(inputString);
  console.log(res1);
  console.log(res2);

  process.exit(1);
}

var end = Date.now();
var ms = end - ms;
var avg = ms / count;

console.log(`
  === NO ERRORS FOUND ===
  TOTAL EXECUTION TIME: ${ms}ms
  AVERAGE ITERATION TIME: ${avg}ms
  ITERATIONS: ${count}
`);
