/**
 * Escape sequence to hardcoded value
 */
const ESCAPE_TABLE = {
  '"': '"',
  "\\": "\\",
  "/": "/",
  b: "\b",
  f: "\f",
  n: "\n",
  r: "\r",
  t: "\t",
};

/**
 * Valid hex digits. Assumes input is uppercased before checked.
 */
const HEX_DIGITS = new Set([
  "0",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
]);

/**
 * Whitespace characters outside of quotes are discarded
 *
 * https://www.json.org/img/whitespace.png
 */
const WHITESPACE_CHARS = new Set([" ", "\t", "\n", "\r"]);

/**
 * Parses a JSON-string into an JavaScript Object.
 *
 * @param {*} string
 * @returns
 */
function JSONParse(string) {
  string = "" + string;

  var returnValue = undefined;

  /**
   * An array of opening braces representing the open braces
   *
   * Example: ["{", "[", "{"]
   */
  var paramStack = [];

  /**
   * An array of objects and arrays representing the object being parsed
   *
   * Example: [ {}, [] ]
   */
  var cursorStack = [];

  /**
   * An array of objects representing certain state of the cursor
   *
   * Example: [ {inKey: false, inProperty: true} ]
   */
  var settingsStack = [];

  /**
   * The current token being read in
   */
  var currentToken = "";

  /**
   * Determines if in quoted token
   */
  var inQuotes = false;

  /**
   * Property name stack
   */
  var propertyNameStack = [];

  function setCursor(newCursor) {
    if (returnValue === undefined) {
      returnValue = newCursor;
    }

    cursorStack.push(newCursor);
  }

  /**
   * Pop literal value if any
   */
  function popLiteral() {
    if (currentToken) {
      endCurrentToken();
    }
  }

  /**
   * Pop literal value if any
   * Pop cursor (required)
   */
  function popCursorOrLiteral() {
    if (currentToken) {
      popLiteral();
    }

    var cursor = cursorStack.pop();
    paramStack.pop();
    settingsStack.pop();

    endCurrentToken(true, cursor);
  }

  function endCurrentToken(override, value) {
    var cursor = cursorStack[cursorStack.length - 1];
    var context = paramStack[paramStack.length - 1];
    var inArray = context === "[";
    var inObject = context === "{";

    var parsedValue;

    if (override) {
      parsedValue = value;
    } else {
      if (currentToken.startsWith('"') && currentToken.endsWith('"')) {
        parsedValue = currentToken.slice(1, -1);
      } else if (!isNaN(currentToken)) {
        // Numbers cannot start with +
        if (currentToken.startsWith("+")) {
          throw new Error(
            "Unexpected character +, not allowed in number" + here
          );
        }

        if (currentToken.startsWith(".")) {
          throw new Error(
            "Unexpected character ., number cannot start with a dot" + here
          );
        }

        // Numbers cannot end with .
        if (currentToken.endsWith(".")) {
          throw new Error("Unexpected character ." + here);
        }

        var integer = currentToken.split("e")[0].split(".")[0];
        if (integer.startsWith("-")) {
          integer = integer.slice(1);
        }
        if (integer.length > 1 && integer.startsWith("0")) {
          throw new Error(
            "Unexpected character 0, octal numbers are disallowed" + here
          );
        }

        parsedValue = parseFloat(currentToken);

        // Disallow
        if (
          parsedValue === Infinity ||
          parsedValue === -Infinity ||
          parsedValue !== parsedValue
        ) {
          throw new Error("Invalid value: " + currentToken + here);
        }
      } else {
        switch (currentToken) {
          case "null":
            parsedValue = null;
            break;
          case "true":
            parsedValue = true;
            break;
          case "false":
            parsedValue = false;
            break;
          default:
            throw new Error(
              "Invalid type: " + currentToken.slice(0, 50) + here
            );
        }
      }
    }

    if (inArray) {
      cursor.push(parsedValue);
    } else if (inObject) {
      /**
       * Get the property name token
       */
      var propertyName = propertyNameStack.pop();

      /**
       * Property names must be enclosed in quotes
       */
      if (!propertyName.startsWith('"') || !propertyName.endsWith('"')) {
        throw new Error("Property name must be enclosed in quotes" + here);
      }

      var unquoted = propertyName.slice(1, -1);
      cursor[unquoted] = parsedValue;

      // The caller of endCurrentToken is responsible for changing the settings to allow a new key
    } else if (!returnValue) {
      returnValue = parsedValue;
    } else if (value !== returnValue) {
      throw new Error("Unexpected value" + here);
    }

    currentToken = "";
  }

  /**
   * Line numbers start at 1
   */
  var lineNumber = 1;
  var colNumber = 0;

  /**
   * Flag determining if the parser is allowed to read any type of token next
   */
  var readAny = true;

  /**
   * Flag determining if a value has been read
   */
  var hasRead = false;

  /**
   * Flag determining if a cursor was 'just' closed.
   *
   * 'just' means the previous iteration of the loop closed the cursor.
   * With exception for whitespace characters.
   */
  var justFinishedCursor = false;

  /**
   * Flag determining if reading an escape sequence
   */
  var isEscaped = false;

  /**
   * The escaped text being read in
   */
  var escapeText = "";

  for (var i = 0; i < string.length; i++) {
    var char = string[i];

    // keep track of location for useful error messages
    if (char === "\n") {
      lineNumber += 1;
      colNumber = 0;
    } else {
      colNumber++;
    }

    var here = " (Line " + lineNumber + ", Column " + colNumber + ")";

    // ensure all stacks are equal length
    if (
      new Set([settingsStack.length, paramStack.length, cursorStack.length])
        .size !== 1
    ) {
      console.log(settingsStack, paramStack, cursorStack);
      throw new Error("Mismatch stack size" + here);
    }

    var context = paramStack[paramStack.length - 1];
    var inArray = context === "[";
    var inObject = context === "{";

    var settings = settingsStack[settingsStack.length - 1];

    if (inQuotes) {
      // in escape mode, all characters are discarded until the escape sequence is finished
      if (isEscaped) {
        escapeText += char;

        // "u" is a wildcard allowing 4 hex digits afterwards
        if (escapeText.startsWith("u")) {
          if (escapeText.length > 1) {
            // validate this is hex digit

            if (!HEX_DIGITS.has(char.toUpperCase())) {
              throw new Error("Invalid hex digit " + char + here);
            }

            // the sequence is finished
            if (escapeText.length === 5) {
              var hexString = escapeText.slice(1);
              var int = parseInt(hexString, 16);

              if (int !== int) {
                throw new Error("Invalid integer " + int + here);
              }

              // add escaped value
              currentToken += String.fromCharCode(int);

              // break out of escape mode
              isEscaped = false;
              escapeText = "";
            }
          }
        } else {
          if (!ESCAPE_TABLE[escapeText]) {
            throw new Error("Invalid escape sequence \\" + escapeText + here);
          } else {
            // add escaped value
            currentToken += ESCAPE_TABLE[escapeText];

            // break out of escape mode
            isEscaped = false;
            escapeText = "";

            continue;
          }
        }

        continue;
      }

      if (char === "\\") {
        // begin escape sequence

        isEscaped = true;
        escapeText = "";
        continue;
      }
    }

    if (char === '"') {
      if (!inQuotes) {
        // checks when opening new quotes
        if (!readAny) {
          throw new Error('Unexpected character "' + here);
        }

        if (settings) {
          if (settings.hasValue) {
            throw new Error('Unexpected character "' + here);
          }
          settings.invalidFlag = false;
        }
      }
      inQuotes = !inQuotes;
      justFinishedCursor = false;

      if (!inQuotes) {
        readAny = false;

        if (settings) {
          settings.hasValue = true;
        }
      }
    }

    if (!inQuotes) {
      if (WHITESPACE_CHARS.has(char)) {
        continue;
      }

      hasRead = true;

      if (char === "[") {
        /**
         * Read check
         */
        if (!readAny) {
          throw new Error(
            "Unexpected character [, not allowed at this time" + here
          );
        }

        /**
         * Object key check
         */
        if (inObject && settings && settings.inKey) {
          throw new Error(
            'Unexpected character [, expected " for object key' + here
          );
        }

        if (settings && settings.hasValue) {
          throw new Error("Unexpected character [, expected comma" + here);
        }

        /**
         * Error on "null[]"
         */
        if (currentToken) {
          throw new Error(
            "Unexpected character [, not allowed after token" + here
          );
        }

        if (settings) {
          settings.invalidFlag = false;
        }

        paramStack.push("[");
        settingsStack.push({ hasValue: false }); // Reduced settings for arrays
        setCursor([]);
        currentToken = "";
        readAny = true;
        justFinishedCursor = false;
        continue;
      } else if (char === "{") {
        /**
         * Read check. Error on "{}{}"
         */
        if (!readAny) {
          throw new Error(
            "Unexpected character {, not allowed at this time" + here
          );
        }

        /**
         * Object key check. Error on "{{}:0}"
         */
        if (inObject && settings && settings.inKey) {
          throw new Error(
            'Unexpected character {, expected " for object key' + here
          );
        }

        /**
         * Error on "[{}{}]"
         */
        if (settings && settings.hasValue) {
          throw new Error("Unexpected character {, expected comma" + here);
        }

        /**
         * Error on "null{}"
         */
        if (currentToken) {
          throw new Error(
            "Unexpected character {, not allowed after token" + here
          );
        }

        if (settings) {
          settings.invalidFlag = false;
        }

        paramStack.push("{");
        settingsStack.push({
          inKey: true,
          inProperty: false,
          hasValue: false,
          invalidFlag: false,
        });
        setCursor({});
        currentToken = "";
        readAny = true;
        justFinishedCursor = false;
        continue;
      } else if (char === ",") {
        if (!inArray && !inObject) {
          throw new Error(
            "Unexpected character comma, only allowed inside arrays or objects" +
              here
          );
        }

        // console.log(paramStack, cursorStack);

        if (inObject && settings && settings.inKey) {
          if (currentToken.length) {
            // Key but no value
            throw new Error(
              "Unexpected character comma, expected property value" + here
            );
          } else {
            // No key
            throw new Error(
              "Unexpected character comma, expected object key" + here
            );
          }
        }

        if (!currentToken && !justFinishedCursor) {
          if (inObject) {
            // Key but no value
            throw new Error(
              "Unexpected character comma, expected property value" + here
            );
          } else {
            // Array, empty element
            throw new Error(
              "Unexpected character comma, expected element value" + here
            );
          }
        }

        popLiteral();
        readAny = true;
        justFinishedCursor = false;

        // Read another key if inside curly braces
        settings = settingsStack[settingsStack.length - 1];

        if (settings) {
          settings.hasValue = false;
          if (paramStack[paramStack.length - 1] === "{") {
            settings.inKey = true;
            settings.inProperty = false;
          }
        }

        continue;
      } else if (char === ":") {
        if (inArray || (settings && settings.inProperty)) {
          throw new Error(
            "Unexpected character " +
              char +
              ", " +
              (inArray
                ? "not allowed in array"
                : "not allowed in property value") +
              here
          );
        }

        if (settings && settings.inKey) {
          if (!currentToken) {
            throw new Error(
              "Unexpected character :, expected object key" + here
            );
          }

          propertyNameStack.push(currentToken);
          currentToken = "";
          settings.inProperty = true;
          settings.inKey = false;
          settings.hasValue = false;
          settings.invalidFlag = true;
          readAny = true;
          justFinishedCursor = false;
          continue;
        } else {
          throw new Error(
            "Unexpected character " +
              char +
              ", " +
              "not allowed in keyword" +
              here
          );
        }
      }

      if (char === "]" || char === "}") {
        if (!paramStack.length) {
          throw new Error(
            "Unexpected character " + char + ", nothing to close" + here
          );
        }

        if (char === "}" && settings.inKey && currentToken.length) {
          throw new Error(
            "Unexpected character " + char + ", expected property value" + here
          );
        }

        var converted = { "{": "}", "[": "]" }[context];

        if (converted !== char) {
          throw new Error(
            "Unexpected character " + char + ", expected " + converted + here
          );
        }

        /**
         * validate object key and value
         */

        if (
          inObject &&
          settings &&
          settings.invalidFlag &&
          !currentToken &&
          !justFinishedCursor
        ) {
          // Key but no value
          throw new Error(
            "Unexpected character }, expected property value" + here
          );
        }

        /**
         * check for trailing comma
         */
        if (settings && !settings.hasValue && !currentToken) {
          if (inArray && cursorStack[cursorStack.length - 1].length) {
            throw new Error(
              "Unexpected character " +
                char +
                ", trailing comma is disallowed" +
                here
            );
          }
          if (
            inObject &&
            Object.keys(cursorStack[cursorStack.length - 1]).length
          ) {
            throw new Error(
              "Unexpected character " +
                char +
                ", trailing comma is disallowed" +
                here
            );
          }
        }

        popCursorOrLiteral();
        justFinishedCursor = true;

        var settings = settingsStack[settingsStack.length - 1];
        if (settings) {
          settings.hasValue = true;
        } else {
          // If no settings means all braces are closed
          readAny = false;
        }

        continue;
      } else {
        justFinishedCursor = false;
      }
    }

    // Quotes are taken care of earlier in the iteration cycle
    if (char !== '"') {
      if (!readAny) {
        throw new Error("Unexpected character " + char + here);
      }
      if (settings && settings.hasValue) {
        throw new Error("Unexpected character " + char + here);
      }

      if (settings) {
        settings.invalidFlag = false;
      }
    }

    currentToken += char;
  }

  /**
   * Check for unterminated string
   */
  if (inQuotes) {
    throw new Error("Unexpected end of input, unterminated quote");
  }

  /**
   * Check for unclosed braces
   */
  if (cursorStack.length) {
    throw new Error(
      "Unexpected end of input, unterminated curly or square brackets"
    );
  }

  if (!hasRead) {
    throw new Error("Unexpected end of input, expected value");
  }

  /**
   * If the current token wasn't dealt with, then deal with it here
   */
  if (currentToken) {
    endCurrentToken();
  }

  return returnValue;
}

module.exports = JSONParse;
