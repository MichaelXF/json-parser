const JSONParse = require("../src/JSONParse");

test("Variant 1: True", () => {
  var inputString = "true";

  var output = JSONParse(inputString);

  expect(output).toStrictEqual(true);
});

test("Variant 2: False", () => {
  var inputString = "false";

  var output = JSONParse(inputString);

  expect(output).toStrictEqual(false);
});

test("Variant 3: True in array", () => {
  var inputString = "[true]";

  var output = JSONParse(inputString);

  expect(output).toStrictEqual([true]);
});

test("Variant 4: False in array", () => {
  var inputString = "[false]";

  var output = JSONParse(inputString);

  expect(output).toStrictEqual([false]);
});

test("Variant 5: True in object", () => {
  var inputString = '{"key": true}';

  var output = JSONParse(inputString);

  expect(output).toStrictEqual({ key: true });
});

test("Variant 6: False in object", () => {
  var inputString = '{"key": false}';

  var output = JSONParse(inputString);

  expect(output).toStrictEqual({ key: false });
});
