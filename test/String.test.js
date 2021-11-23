const JSONParse = require("../src/JSONParse");

test("Variant 1: Standalone string", () => {
  var inputString = '"Hello World"';

  var output = JSONParse(inputString);

  expect(output).toStrictEqual("Hello World");
});

test("Variant 2: String in array", () => {
  var inputString = '["Hello World"]';

  var output = JSONParse(inputString);

  expect(output).toStrictEqual(["Hello World"]);
});

test("Variant 3: String in object", () => {
  var inputString = '{"Hello": "World"}';

  var output = JSONParse(inputString);

  expect(output).toStrictEqual({ Hello: "World" });
});

test("Variant 4: Escape quotes with backslash", () => {
  var inputString = '"Hello \\"World\\""';

  var output = JSONParse(inputString);

  expect(output).toStrictEqual('Hello "World"');
});

test("Variant 5: Escaped hex sequence", () => {
  var inputString = '"Hello \\u1000"';

  var output = JSONParse(inputString);

  expect(output).toStrictEqual("Hello \u1000");
});

test("Variant 6: Error on invalid hex digit in escape sequence", () => {
  var inputString = '"Hello \\uZZZZ"';

  expect(() => {
    JSONParse(inputString);
  }).toThrow("Invalid hex digit Z");
});

test("Variant 7: Error on invalid escape sequence", () => {
  var inputString = '"Hello \\K"';

  expect(() => {
    JSONParse(inputString);
  }).toThrow("Invalid escape sequence \\K");
});

test("Variant 8: Error on multiple strings right next to each other", () => {
  var inputString = '"string1" "string2"';

  expect(() => {
    JSONParse(inputString);
  }).toThrow('Unexpected character "');
});

test("Variant 9: Error on multiple strings right next to each other with a comma", () => {
  var inputString = '"string1", "string2"';

  expect(() => {
    JSONParse(inputString);
  }).toThrow(
    "Unexpected character comma, only allowed inside arrays or objects"
  );
});

test("Variant 10: Error on multiple strings right next to each other with a colon", () => {
  var inputString = '"string1": "string2"';

  expect(() => {
    JSONParse(inputString);
  }).toThrow("Unexpected character :, not allowed in keyword");
});
