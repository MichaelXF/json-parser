const JSONParse = require("../src/JSONParse");

test("Variant 1: Positive integer", () => {
  var inputString = "1";

  var output = JSONParse(inputString);

  expect(output).toStrictEqual(1);
});

test("Variant 2: Zero", () => {
  var inputString = "0";

  var output = JSONParse(inputString);

  expect(output).toStrictEqual(0);
});

test("Variant 3: Negative integer", () => {
  var inputString = "-1";

  var output = JSONParse(inputString);

  expect(output).toStrictEqual(-1);
});

test("Variant 4: Positive decimal", () => {
  var inputString = "1.5";

  var output = JSONParse(inputString);

  expect(output).toStrictEqual(1.5);
});

test("Variant 5: Negative decimal", () => {
  var inputString = "-1.5";

  var output = JSONParse(inputString);

  expect(output).toStrictEqual(-1.5);
});

test("Variant 5: Negative decimal", () => {
  var inputString = "-1.5";

  var output = JSONParse(inputString);

  expect(output).toStrictEqual(-1.5);
});

test("Variant 6: Positive exponent", () => {
  var inputString = "1e21";

  var output = JSONParse(inputString);

  expect(output).toStrictEqual(1e21);
});

test("Variant 7: Negative decimal inside array", () => {
  var inputString = "[-1.5]";

  var output = JSONParse(inputString);

  expect(output).toStrictEqual([-1.5]);
});

test("Variant 8: Negative decimal as property value", () => {
  var inputString = '{ "key": -1.5 }';

  var output = JSONParse(inputString);

  expect(output).toStrictEqual({ key: -1.5 });
});