const JSONParse = require("../src/JSONParse");

test("Variant 1: Null", () => {
  var inputString = "null";

  var output = JSONParse(inputString);

  expect(output).toStrictEqual(null);
});

test("Variant 2: Null in array", () => {
  var inputString = "[null]";

  var output = JSONParse(inputString);

  expect(output).toStrictEqual([null]);
});

test("Variant 3: Null in object value", () => {
  var inputString = '{"key": null}';

  var output = JSONParse(inputString);

  expect(output).toStrictEqual({ key: null });
});

test("Variant 4: Null with space after it", () => {
  var inputString = "null ";

  var output = JSONParse(inputString);

  expect(output).toStrictEqual(null);
});

test("Variant 5: Null with space before it", () => {
  var inputString = " null";

  var output = JSONParse(inputString);

  expect(output).toStrictEqual(null);
});
