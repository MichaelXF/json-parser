const JSONParse = require("../src/JSONParse");

/**
 * == UNTERMINATED ERRORS ==
 */
test("Variant 1: Error on unterminated string", () => {
  var inputString = '"The ending quote cannot be found';

  expect(() => {
    JSONParse(inputString);
  }).toThrow("Unexpected end of input, unterminated quote");
});

test("Variant 2: Error on unterminated curly brace", () => {
  var inputString = '{ "key": "value" ';

  expect(() => {
    JSONParse(inputString);
  }).toThrow("Unexpected end of input, unterminated curly or square brackets");
});

test("Variant 3: Error on unterminated square brace", () => {
  var inputString = '[ "element1", "element2" ';

  expect(() => {
    JSONParse(inputString);
  }).toThrow("Unexpected end of input, unterminated curly or square brackets");
});

/**
 * == UNQUOTED PROPERTY NAME ERROR ==
 */
test("Variant 4: Error on unquoted property name", () => {
  var inputString = "{ unquoted: true }";

  expect(() => {
    JSONParse(inputString);
  }).toThrow("Property name must be enclosed in quotes");
});

/**
 * == BRACE VALIDATION ERRORS ==
 */
test("Variant 5: Error on closing with incorrect brace type", () => {
  var inputString = "[ { ] }";

  expect(() => {
    JSONParse(inputString);
  }).toThrow("Unexpected character ], expected }");
});

test("Variant 6: Error on closing too many braces", () => {
  var inputString = "[ { } ] }";

  expect(() => {
    JSONParse(inputString);
  }).toThrow("Unexpected character }, nothing to close");
});

/**
 * == COMMA VALIDATION ERROR ==
 */
test("Variant 7: Error on multiple commas next to each other in array", () => {
  var inputString = "[,,]";

  expect(() => {
    JSONParse(inputString);
  }).toThrow("Unexpected character comma, expected element value");
});

/**
 * == KEYWORD VALIDATION ERROR ==
 */
test("Variant 8: Error on unknown keyword", () => {
  var inputString = "[you]";

  expect(() => {
    JSONParse(inputString);
  }).toThrow("Invalid type");
});

/**
 * == TOP LEVEL VALUE READING VALIDATION ERROR ==
 */
test("Variant 9: Error on multiple objects", () => {
  var inputString = "{} {}";

  expect(() => {
    JSONParse(inputString);
  }).toThrow("Unexpected character {, not allowed at this time");
});

test("Variant 10: Error on multiple strings", () => {
  var inputString = '"string1" "string2"';

  expect(() => {
    JSONParse(inputString);
  }).toThrow('Unexpected character "');
});

test("Variant 11: Error on object and string", () => {
  var inputString = '{} "string2"';

  expect(() => {
    JSONParse(inputString);
  }).toThrow('Unexpected character "');
});

test("Variant 12: Error on string and object", () => {
  var inputString = '"string1" {}';

  expect(() => {
    JSONParse(inputString);
  }).toThrow("Unexpected character {, not allowed at this time");
});

test("Variant 11: Error on object and number", () => {
  var inputString = "{} 0";

  expect(() => {
    JSONParse(inputString);
  }).toThrow("Unexpected character 0");
});

test("Variant 12: Error on string and number", () => {
  var inputString = '"string1" 0';

  expect(() => {
    JSONParse(inputString);
  }).toThrow("Unexpected character 0");
});

/**
 * == OBJECT KEY VALIDATION ==
 */
test("Variant 13: Error on array as object key", () => {
  var inputString = "{[]}";

  expect(() => {
    JSONParse(inputString);
  }).toThrow('Unexpected character [, expected " for object key');
});

test("Variant 14: Error on object as object key", () => {
  var inputString = "{{}}";

  expect(() => {
    JSONParse(inputString);
  }).toThrow('Unexpected character {, expected " for object key');
});

/**
 * == VALUE READING VALIDATION ERROR ==
 */
test("Variant 15: Error on object directly after string", () => {
  var inputString = '{ "key": "value"{} }';

  expect(() => {
    JSONParse(inputString);
  }).toThrow("Unexpected character {, not allowed at this time");
});

test("Variant 16: Error on array directly after string", () => {
  var inputString = '{ "key": "value"[] }';

  expect(() => {
    JSONParse(inputString);
  }).toThrow("Unexpected character [, not allowed at this time");
});

test("Variant 17: Error on string directly after object", () => {
  var inputString = '{ "key": {}"value" }';

  expect(() => {
    JSONParse(inputString);
  }).toThrow('Unexpected character "');
});

test("Variant 18: Error on string directly after array", () => {
  var inputString = '{ "key": []"value" }';

  expect(() => {
    JSONParse(inputString);
  }).toThrow('Unexpected character "');
});

test("Variant 19: Error on null directly after array", () => {
  var inputString = '{ "key": []null }';

  expect(() => {
    JSONParse(inputString);
  }).toThrow("Unexpected character n");
});

test("Variant 20: Error on two empty objects directly next to each other", () => {
  var inputString = "[{}{}]";

  expect(() => {
    JSONParse(inputString);
  }).toThrow("Unexpected character {, expected comma");
});

test("Variant 21: Error on two empty arrays directly next to each other", () => {
  var inputString = "[[][]]";

  expect(() => {
    JSONParse(inputString);
  }).toThrow("Unexpected character [, expected comma");
});

test("Variant 22: Error on empty object directly after null", () => {
  var inputString = "[null{}]";

  expect(() => {
    JSONParse(inputString);
  }).toThrow("Unexpected character {, not allowed after token");
});

test("Variant 23: Error on empty array directly after null", () => {
  var inputString = "[null[]]";

  expect(() => {
    JSONParse(inputString);
  }).toThrow("Unexpected character [, not allowed after token");
});

/**
 * == LINE/COLUMN ERROR ==
 */
test("Variant 24: Error with line/column tracking", () => {
  var inputString = `
{
  unquoted: true
}`;

  expect(() => {
    JSONParse(inputString);
  }).toThrow("Property name must be enclosed in quotes (Line 4, Column 1)");
});

/**
 * == PARSED VALUE VALIDATION ==
 */
test("Variant 25: Error on Infinity", () => {
  var inputString = `Infinity`;

  expect(() => {
    JSONParse(inputString);
  }).toThrow("Invalid value: Infinity");
});

test("Variant 26: Error on functions", () => {
  var inputString = `{key: function(){ return 1 }}`;

  expect(() => {
    JSONParse(inputString);
  }).toThrow();
});

test("Variant 27: Error on number with + sign", () => {
  var inputString = "[+1]";

  expect(() => {
    JSONParse(inputString);
  }).toThrow("Unexpected character +, not allowed in number");
});

test("Variant 28: Error on number with character after it", () => {
  var inputString = "[1s]";

  expect(() => {
    JSONParse(inputString);
  }).toThrow("Invalid type: 1s");
});

test("Variant 29: Error on empty string", () => {
  var inputString = "";

  expect(() => {
    JSONParse(inputString);
  }).toThrow("Unexpected end of input, expected value");
});

/**
 * == GITHUB ISSUE 1 ==
 */
test("Variant 30: Error on {0:}", () => {
  var inputString = "{0:}";

  expect(() => {
    JSONParse(inputString);
  }).toThrow("Unexpected character }, expected property value");
});

test("Variant 31: Error on {:}", () => {
  var inputString = "{:}";

  expect(() => {
    JSONParse(inputString);
  }).toThrow("Unexpected character :, expected object key");
});

/**
 * == GITHUB ISSUE 2 ==
 */
test("Variant 32: Error on [{},,[]]", () => {
  var inputString = "[{},,[]]";

  expect(() => {
    JSONParse(inputString);
  }).toThrow("Unexpected character comma, expected element value");
});
