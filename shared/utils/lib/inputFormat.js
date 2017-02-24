var dataFormat;

function isDelimiter(letter, delimiter, delimiters) {
  // single delimiter
  if (delimiters.length === 0) {
    return letter === delimiter;
  }

  // multiple delimiters
  return delimiters.some(function (current) {
    if (letter === current) {
      return true;
    }
  });
}

/**
 *
 *
 * @param {any} value
 * @param {any} blocks
 * @param {any} blocksLength
 * @param {any} delimiter
 * @param {any} delimiters
 * @returns
 */
function getFormattedValue(value, blocks, blocksLength, delimiter, delimiters) {
  var result = '';
  var multipleDelimiters = delimiters.length > 0;
  var currentDelimiter;

  // no options, normal input
  if (blocksLength === 0) {
    return value;
  }

  blocks.forEach(function (length, index) {
    if (value.length > 0) {
      var sub = value.slice(0, length);
      var rest = value.slice(length);

      result += sub;

      currentDelimiter = multipleDelimiters ? (delimiters[index] || currentDelimiter) : delimiter;
      if (sub.length === length && index < blocksLength - 1) {
        result += currentDelimiter;
      }
      // update remaining string
      value = rest;
    }
  });

  return result;
}

function getMaxLength(blocks) {
  return blocks.reduce(function (previous, current) {
      return previous + current;
  }, 0);
}
function stripDelimiters(value, delimiter, delimiters) {
  // single delimiter
  if (delimiters.length === 0) {
    var delimiterRE = delimiter ? new RegExp('\\' + delimiter, 'g') : '';

    return value.replace(delimiterRE, '');
  }

  // multiple delimiters
  delimiters.forEach(function (current) {
    value = value.replace(new RegExp('\\' + current, 'g'), '');
  });

  return value;
}

dataFormat = {
  isDelimiter: isDelimiter,
  getFormattedValue: getFormattedValue,
  getMaxLength: getMaxLength,
  stripDelimiters: stripDelimiters,
}

// exports
if (typeof module === "object" && typeof module.exports === "object") {
  module.exports = dataFormat;
}
