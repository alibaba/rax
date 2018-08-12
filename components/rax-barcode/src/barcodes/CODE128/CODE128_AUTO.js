import CODE128 from './CODE128.js';

class CODE128AUTO extends CODE128 {
  constructor(data, options) {
    // ASCII value ranges 0-127, 200-211
    if (data.search(/^[\x00-\x7F\xC8-\xD3]+$/) !== -1) {
      super(autoSelectModes(data), options);
    } else {
      super(data, options);
    }
  }
}

function autoSelectModes(string) {
  // ASCII ranges 0-98 and 200-207 (FUNCs and SHIFTs)
  var aLength = string.match(/^[\x00-\x5F\xC8-\xCF]*/)[0].length;
  // ASCII ranges 32-127 and 200-207 (FUNCs and SHIFTs)
  var bLength = string.match(/^[\x20-\x7F\xC8-\xCF]*/)[0].length;
  // Number pairs or [FNC1]
  var cLength = string.match(/^(\xCF*[0-9]{2}\xCF*)*/)[0].length;

  var newString;
  // Select CODE128C if the string start with enough digits
  if (cLength >= 2) {
    newString = String.fromCharCode(210) + autoSelectFromC(string);
  } else if (aLength > bLength) {
    // Select A/C depending on the longest match
    newString = String.fromCharCode(208) + autoSelectFromA(string);
  } else {
    newString = String.fromCharCode(209) + autoSelectFromB(string);
  }

  newString = newString.replace(/[\xCD\xCE]([^])[\xCD\xCE]/, function(match, char) {
    return String.fromCharCode(203) + char;
  });

  return newString;
}

function autoSelectFromA(string) {
  var untilC = string.match(/^([\x00-\x5F\xC8-\xCF]+?)(([0-9]{2}){2,})([^0-9]|$)/);

  if (untilC) {
    return untilC[1] + String.fromCharCode(204) + autoSelectFromC(string.substring(untilC[1].length));
  }

  var aChars = string.match(/^[\x00-\x5F\xC8-\xCF]+/);
  if (aChars[0].length === string.length) {
    return string;
  }

  return aChars[0] + String.fromCharCode(205) + autoSelectFromB(string.substring(aChars[0].length));
}

function autoSelectFromB(string) {
  var untilC = string.match(/^([\x20-\x7F\xC8-\xCF]+?)(([0-9]{2}){2,})([^0-9]|$)/);

  if (untilC) {
    return untilC[1] + String.fromCharCode(204) + autoSelectFromC(string.substring(untilC[1].length));
  }

  var bChars = string.match(/^[\x20-\x7F\xC8-\xCF]+/);
  if (bChars[0].length === string.length) {
    return string;
  }

  return bChars[0] + String.fromCharCode(206) + autoSelectFromA(string.substring(bChars[0].length));
}


function autoSelectFromC(string) {
  var cMatch = string.match(/^(\xCF*[0-9]{2}\xCF*)+/)[0];
  var length = cMatch.length;

  if (length === string.length) {
    return string;
  }

  string = string.substring(length);

  // Select A/B depending on the longest match
  var aLength = string.match(/^[\x00-\x5F\xC8-\xCF]*/)[0].length;
  var bLength = string.match(/^[\x20-\x7F\xC8-\xCF]*/)[0].length;
  if (aLength >= bLength) {
    return cMatch + String.fromCharCode(206) + autoSelectFromA(string);
  } else {
    return cMatch + String.fromCharCode(205) + autoSelectFromB(string);
  }
}

export default CODE128AUTO;
