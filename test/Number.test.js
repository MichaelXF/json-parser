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

test("Variant 9: Error on number starting with 0", () => {
  var inputString = "01";

  expect(() => {
    JSONParse(inputString);
  }).toThrow("Unexpected character 0, octal numbers are disallowed");
});

/**
 * == GITHUB ISSUE 4 ==
 */
test("Variant 10: Positive decimal less than 1", () => {
  var inputString = '{ "key": 0.5 }';

  var output = JSONParse(inputString);

  expect(output).toStrictEqual({ key: 0.5 });
});

test("Variant 11: Error on negative number starting with 0", () => {
  var inputString = "-01";

  expect(() => {
    JSONParse(inputString);
  }).toThrow("Unexpected character 0, octal numbers are disallowed");
});

/**
 * == GITHUB ISSUE 5 ==
 */
test("Variant 12: Error on trailing period in number", () => {
  var inputString = "1.";

  expect(() => {
    JSONParse(inputString);
  }).toThrow("Unexpected character .");
});

/**
 * == GITHUB ISSUE 6 ==
 */
test("Variant 13: Error on number starting with dot", () => {
  var inputString = ".0";

  expect(() => {
    JSONParse(inputString);
  }).toThrow("Unexpected character ., number cannot start with a dot");
});

/**
 * == GITHUB ISSUE 7 ==
 */
test("Variant 14: Error on number with dot and e right next to each other", () => {
  var inputString = "0.e0";

  expect(() => {
    JSONParse(inputString);
  }).toThrow("Unexpected character ., expected digit");
});
