var JSONParse = require("./src/JSONParse");

var count = 100000;
var errors = 0;
var now = Date.now();

/**
 * Generates a string that is likely to produce an error.
 * @param {number} length
 * @returns
 */
function getInputString(length) {
  var output = "";
  var characterSet = ['"', "{", "}", "[", "]", ",", "0", ".", "e"];
  var stack = [];
  var inQuotes = false;
  var hasValue = false;

  for (var i = 0; i < length; i++) {
    var char = characterSet[Math.floor(characterSet.length * Math.random())];

    if (!inQuotes) {
      if (char !== '"') {
        hasValue = false;
      }
      if (
        char === '"' &&
        (output[output.length - 1] === "0" ||
          output[output.length - 1] === '"' ||
          output[output.length - 1] === "]" ||
          output[output.length - 1] === "}")
      ) {
        continue;
      }
      if (
        char === "0" &&
        (output[output.length - 1] === '"' ||
          output[output.length - 1] === "]" ||
          output[output.length - 1] === "}")
      ) {
        continue;
      }

      var param = stack[stack.length - 1];

      if (
        char === "," &&
        (output[output.length - 1] === "," ||
          output[output.length - 1] === "{" ||
          output[output.length - 1] === "[")
      ) {
        continue;
      }

      if (char === ":" && param !== "{") {
        continue;
      }
      if (!param && char === ",") {
        continue;
      }

      if (char == "{" || char == "[") {
        if (
          output[output.length - 1] === '"' ||
          output[output.length - 1] === "}" ||
          output[output.length - 1] === "{" ||
          output[output.length - 1] === "]" ||
          output[output.length - 1] === "0"
        ) {
          continue;
        }
        stack.push({ "{": "}", "[": "]" }[char]);
      }

      if (char == "}" || char == "]") {
        if (
          output[output.length - 1] === "," ||
          output[output.length - 1] === ":"
        ) {
          continue;
        }

        var last = stack[stack.length - 1];

        if (!last || char != last) {
          continue;
        }

        stack.pop();

        if (!stack.length) {
          output += char;

          break;
        }
      }
    }

    if (char === '"' || char === "0" || char === "1") {
      if (!stack.length) {
        continue;
      }
    }

    if (char === '"') {
      if (hasValue) {
        continue;
      }
      inQuotes = !inQuotes;
      if (!inQuotes) {
        hasValue = true;
      }
    }

    if ((char === "0" || char === "1") && output[output.length - 1] === "0") {
      continue;
    }

    output += char;
  }

  if (inQuotes) {
    output += '"';
  }

  output += stack.reverse().join("");

  return output;
}

for (var i = 0; i < count; i++) {
  var inputString = getInputString(Math.random() * 40 + 7);
  if (!inputString) {
    continue;
  }

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
    if (i % 100) {
      console.log(res1.status, inputString, res1.data?.message);
    }

    if (res1.status === "error") {
      errors++;
    }
    continue;
  }

  console.log(inputString);
  console.log(res1);
  console.log(res2);

  process.exit(1);
}

var end = Date.now();
var ms = end - now;
var avg = ms / count;

console.log(`
  === NO ERRORS FOUND ===
  TOTAL EXECUTION TIME: ${ms}ms
  AVERAGE ITERATION TIME: ${avg}ms
  ITERATIONS: ${count}

  SUCCESS RATE: ${Math.floor((1 - errors / count) * 100)}%
`);
