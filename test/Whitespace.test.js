const JSONParse = require("../src/JSONParse");

test("Variant 1: Allow no spaces", () => {
  var inputString =
    '["Hello World",{"My Key":40,"My 2nd Key":[10,"Another String"]}]';

  var output = JSONParse(inputString);

  expect(output).toStrictEqual([
    "Hello World",
    { "My Key": 40, "My 2nd Key": [10, "Another String"] },
  ]);
});

test("Variant 2: Allow extra spaces", () => {
  var inputString =
    '[ "Hello World", { "My Key": 40, "My 2nd Key": [ 10, "Another String" ] } ]';

  var output = JSONParse(inputString);

  expect(output).toStrictEqual([
    "Hello World",
    { "My Key": 40, "My 2nd Key": [10, "Another String"] },
  ]);
});

test("Variant 3: Allow extra tabs", () => {
  var inputString =
    '[\t"Hello World",\t{\t"My Key":\t40,\t"My 2nd Key":\t[\t10,\t"Another String"\t]\t}\t]';

  var output = JSONParse(inputString);

  expect(output).toStrictEqual([
    "Hello World",
    { "My Key": 40, "My 2nd Key": [10, "Another String"] },
  ]);
});

test("Variant 4: Allow extra new line characters", () => {
  var inputString =
    '[\n"Hello World",\n{\n"My Key":\n40,\n"My 2nd Key":\n[\n10,\n"Another String"\n]\n}\n]';

  var output = JSONParse(inputString);

  expect(output).toStrictEqual([
    "Hello World",
    { "My Key": 40, "My 2nd Key": [10, "Another String"] },
  ]);
});

test("Variant 5: Allow extra carriage return characters", () => {
  var inputString =
    '[\r\r"Hello World",\r{\r"My Key":\r40,\r"My 2nd Key":\r[\r10,\r"Another String"\r]\r}\r]';

  var output = JSONParse(inputString);

  expect(output).toStrictEqual([
    "Hello World",
    { "My Key": 40, "My 2nd Key": [10, "Another String"] },
  ]);
});

test("Variant 5: Allow a combination of spaces, tabs, newlines, and carriage returns", () => {
  var inputString =
    '[\r\r\t\n\n \t  \r\n"Hello World",\r\r\t\n\n \t  \r\n{\r\r\t\n\n \t  \r\n"My Key":\r\r\t\n\n \t  \r\n40,\r\r\t\n\n \t  \r\n"My 2nd Key":\r\r\t\n\n \t  \r\n[\r\r\t\n\n \t  \r\n10,\r\r\t\n\n \t  \r\n"Another String"\r\r\t\n\n \t  \r\n]\r\r\t\n\n \t  \r\n}\r\r\t\n\n \t  \r\n]';

  var output = JSONParse(inputString);

  expect(output).toStrictEqual([
    "Hello World",
    { "My Key": 40, "My 2nd Key": [10, "Another String"] },
  ]);
});
