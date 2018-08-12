var defaultFormat = 'YYYY-MM-DD hh:mm:ss';

var formattingTokens = /(\[[^\[]*\])|(\\)?([Hh]mm(ss)?|Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|W[o|W]?|Qo?|YYYYYY|YYYYY|YYYY|YY|gg(ggg?)?|GG(GGG?)?|e|E|a|A|hh?|HH?|kk?|mm?|ss?|S{1,9}|x|X|zz?|ZZ?|.)/g;

var localFormattingTokens = /(\[[^\[]*\])|(\\)?(LTS|LT|LL?L?L?|l{1,4})/g;

var formatFunctions = {};

var formatTokenFunctions = {};

function zeroFill(number, targetLength, forceSign) {
  var absNumber = '' + Math.abs(number),
    zerosToFill = targetLength - absNumber.length,
    sign = number >= 0;
  return (sign ? forceSign ? '+' : '' : '-') +
    Math.pow(10, Math.max(0, zerosToFill)).toString().substr(1) + absNumber;
}

// token:    'M'
// padded:   ['MM', 2]
// ordinal:  'Mo'
// callback: function () { this.month() + 1 }
function addFormatToken(token, padded, ordinal, callback) {
  var func = callback;
  if (typeof callback === 'string') {
    func = function() {
      return this[callback]();
    };
  }
  if (token) {
    formatTokenFunctions[token] = func;
  }
  if (padded) {
    formatTokenFunctions[padded[0]] = function() {
      return zeroFill(func.apply(this, arguments), padded[1], padded[2]);
    };
  }
  if (ordinal) {
    // Noop
  }
}

addFormatToken(0, ['YY', 2], 0, function() {
  return this.year() % 100;
});

addFormatToken(0, ['YYYY', 4], 0, 'year');

addFormatToken('M', ['MM', 2], 'Mo', function() {
  return this.month() + 1;
});

addFormatToken('D', ['DD', 2], 'Do', 'date');

addFormatToken('h', ['hh', 2], 0, 'hour');

addFormatToken('m', ['mm', 2], 0, 'minute');

addFormatToken('s', ['ss', 2], 0, 'second');

function removeFormattingTokens(input) {
  return input.replace(/\\/g, '');
}

function makeFormatFunction(format) {
  var array = format.match(formattingTokens), i, length;

  for (i = 0, length = array.length; i < length; i++) {
    if (formatTokenFunctions[array[i]]) {
      array[i] = formatTokenFunctions[array[i]];
    } else {
      array[i] = removeFormattingTokens(array[i]);
    }
  }

  return function(mom) {
    var output = '', i;
    for (i = 0; i < length; i++) {
      output += array[i] instanceof Function ? array[i].call(mom, format) : array[i];
    }
    return output;
  };
}

// format date using native date object
export function formatMoment(m, format = defaultFormat) {
  if (!m.isValid()) {
    return null;
  }

  formatFunctions[format] = formatFunctions[format] || makeFormatFunction(format);

  return formatFunctions[format](m);
}
