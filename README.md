# JSONParse

_98.31% coverage_

```js
var JSONParse = require("./src/JSONParse.js");

var object = JSONParse(`
  {
    "firstName": "John",
    "lastName": "Doe",
    "status": {
      "online": false,
      "snooze": true
    }
  }
`);

console.log(object); // {
//    "firstName": "John",
//    "lastName": "Doe",
//    "status": {
//      "online": false,
//      "snooze": true
//    }
//  }
```

`JSONParse` is a JavaScript-based JSON parser without using the native JSON methods.

The purpose of this project was to practice unit testing.

The library is designed to mimic the `JSON.parse` method as closely as possible.

In regards to performance, the `JSON.parse` method is much faster.

In regards to security, the `JSON.parse` method is more secure.

You should use `JSON.parse` instead of this project for any JSON parsing needs.

## Supported types

- [x] Strings
- [x] Numbers
- [x] Booleans
- [x] Null
- [x] Arrays
- [x] Objects

### Supported string escaping

| Escape sequence | Parsed value                             |
| --------------- | ---------------------------------------- |
| `\"`            | `'"'`                                    |
| `\\`            | `"\\"`                                   |
| `\/`            | `"/"`                                    |
| `\b`            | `"\b"`                                   |
| `\f`            | `"\f"`                                   |
| `\n`            | `"\n"`                                   |
| `\r`            | `"\r"`                                   |
| `\t`            | `"\t"`                                   |
| `\u<hex>`       | `String.fromCharCode(parseInt(hex, 16))` |

## Usage

```js
var JSONParse = require("./src/JSONParse.js");

var inputString = `

  {
    "firstName": "John",
    "lastName": "Doe",
    "age": 19,
    "notifications": [],
    "status": {
      "online": false,
      "snooze": true
    }
  }

`;

var object = JSONParse(inputString);

console.log(object); // {
//    "firstName": "John",
//    "lastName": "Doe",
//    "age": 19,
//    "notifications": [],
//    "status": {
//      "online": false,
//      "snooze": true
//    }
//  }
```

## Strict parser

- Unquoted properties
- Trailing commas

If the parser encounters any of these, an error will be thrown.

## Performance

You can run the `./benchmark.js` file to see results for your own machine.

```js
  === JSON.parse ===
  TOTAL EXECUTION TIME: 58ms
  AVERAGE ITERATION TIME: 0.0058ms
  ITERATIONS: 10000


  === JSONParse ===
  TOTAL EXECUTION TIME: 634ms
  AVERAGE ITERATION TIME: 0.0634ms
  ITERATIONS: 10000


  === RESULTS ===
  JSON.parse is 10x times faster than JSONParse
  JSON.parse is 90% percent faster than JSONParse
```

## Tests

The unit tests are located within `test` folder.
