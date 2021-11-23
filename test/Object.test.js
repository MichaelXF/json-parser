const JSONParse = require("../src/JSONParse");

test("Variant 1: Empty object", () => {
  var inputString = "{}";

  var output = JSONParse(inputString);

  expect(output).toStrictEqual({});
});

test("Variant 2: Object with 1 key-value pair", () => {
  var inputString = '{"key": "value"}';

  var output = JSONParse(inputString);

  expect(output).toStrictEqual({ key: "value" });
});

test("Variant 3: Object with multiple key-value pairs", () => {
  var inputString = '{"key1": "value1", "key2": "value2", "key3": "value3"}';

  var output = JSONParse(inputString);

  expect(output).toStrictEqual({
    key1: "value1",
    key2: "value2",
    key3: "value3",
  });
});

test("Variant 4: Object with nested object", () => {
  var inputString =
    '{"before": 0, "outerKey": { "innerKey": "innerValue" }, "after": 1 }';

  var output = JSONParse(inputString);

  expect(output).toStrictEqual({
    before: 0,
    outerKey: { innerKey: "innerValue" },
    after: 1,
  });
});

test("Variant 5: Error on comma in key", () => {
  var inputString = '{ "key1", "key2": "value2" }';

  expect(() => {
    JSONParse(inputString);
  }).toThrow("Unexpected character comma, expected property value");
});

test("Variant 6: Error on colon in property value", () => {
  var inputString = '{ "key1": "value1": "value2" }';

  expect(() => {
    JSONParse(inputString);
  }).toThrow("Unexpected character :, not allowed in property value");
});

test("Variant 7: Error on closing curly brace in key", () => {
  var inputString = '{ "key" }';

  expect(() => {
    JSONParse(inputString);
  }).toThrow("Unexpected character }, expected property value");
});

test("Variant 8: Error on comma without key before", () => {
  var inputString = "{,}";

  expect(() => {
    JSONParse(inputString);
  }).toThrow("Unexpected character comma, expected object key");
});

test("Variant 9: Error on comma without value", () => {
  var inputString = '{"key":,}';

  expect(() => {
    JSONParse(inputString);
  }).toThrow("Unexpected character comma, expected property value");
});

test("Variant 10: Error on trailing comma", () => {
  var inputString = '{"key1": "value1", "key2": "value2", }';

  expect(() => {
    JSONParse(inputString);
  }).toThrow("Unexpected character }, trailing comma is disallowed");
});
