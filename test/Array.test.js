const JSONParse = require("../src/JSONParse");

test("Variant 1: Empty array", () => {
  var inputString = "[]";

  var output = JSONParse(inputString);

  expect(output).toStrictEqual([]);
});

test("Variant 2: Array with one number", () => {
  var inputString = "[1]";

  var output = JSONParse(inputString);

  expect(output).toStrictEqual([1]);
});

test("Variant 3: Array with multiple numbers", () => {
  var inputString = "[1,2,3]";

  var output = JSONParse(inputString);

  expect(output).toStrictEqual([1, 2, 3]);
});

test("Variant 4: Array with nested array", () => {
  var inputString = "[[]]";

  var output = JSONParse(inputString);

  expect(output).toStrictEqual([[]]);
});

test("Variant 5: Array with multiple nested arrays and objects", () => {
  var inputString = "[[], {}, [[], {}, [[], {}]]]";

  var output = JSONParse(inputString);

  expect(output).toStrictEqual([[], {}, [[], {}, [[], {}]]]);
});

test("Variant 6: Error on colon in array", () => {
  var inputString = '["value1":"value2"]';

  expect(() => {
    JSONParse(inputString);
  }).toThrow("Unexpected character :, not allowed in array");
});

test("Variant 7: Error on comma without value before", () => {
  var inputString = "[,]";

  expect(() => {
    JSONParse(inputString);
  }).toThrow("Unexpected character comma, expected element value");
});

test("Variant 8: Error on trailing comma", () => {
  var inputString = "[0,1,2,3,]";

  expect(() => {
    JSONParse(inputString);
  }).toThrow("Unexpected character ], trailing comma is disallowed");
});
