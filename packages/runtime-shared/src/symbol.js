/* eslint no-extend-native: "off", new-cap: "off" */

var defineProperties = Object.defineProperties,
  defineProperty = Object.defineProperty,
  SymbolPolyfill,
  HiddenSymbol,
  globalSymbols = Object.create(null);

function isSymbol(x) {
  if (!x) return false;
  if (typeof x === 'symbol') return true;
  if (!x.constructor) return false;
  if (x.constructor.name !== 'Symbol') return false;
  return x[x.constructor.toStringTag] === 'Symbol';
}

function validateSymbol(value) {
  if (!isSymbol(value)) throw new TypeError(value + ' is not a symbol');
  return value;
}

var generateName = (function() {
  var created = Object.create(null);
  return function(desc) {
    var postfix = 0, name;
    while (created[desc + (postfix || '')]) ++postfix;
    desc += postfix || '';
    created[desc] = true;
    name = '@@' + desc;
    return name;
  };
}());

// Internal constructor (not one exposed) for creating Symbol instances.
// This one is used to ensure that `someSymbol instanceof Symbol` always return false
HiddenSymbol = function Symbol(description) {
  if (this instanceof HiddenSymbol) throw new TypeError('Symbol is not a constructor');
  return SymbolPolyfill(description);
};

// Exposed `Symbol` constructor
// (returns instances of HiddenSymbol)
module.exports = SymbolPolyfill = function Symbol(description) {
  var symbol;
  if (this instanceof Symbol) throw new TypeError('Symbol is not a constructor');
  symbol = Object.create(HiddenSymbol.prototype);
  description = description === undefined ? '' : String(description);
  return defineProperties(symbol, {
    __description__: {value: description},
    __name__: {value: generateName(description)}
  });
};
defineProperties(SymbolPolyfill, {
  for: {value: function(key) {
    if (globalSymbols[key]) return globalSymbols[key];
    return globalSymbols[key] = SymbolPolyfill(String(key));
  }},
  keyFor: {value: function(s) {
    var key;
    validateSymbol(s);
    for (key in globalSymbols) if (globalSymbols[key] === s) return key;
  }},

  // To ensure proper interoperability with other native functions (e.g. Array.from)
  // fallback to eventual native implementation of given symbol
  hasInstance: {value: SymbolPolyfill('hasInstance')},
  isConcatSpreadable: {value: SymbolPolyfill('isConcatSpreadable')},
  iterator: {value: SymbolPolyfill('iterator')},
  match: {value: SymbolPolyfill('match')},
  replace: {value: SymbolPolyfill('replace')},
  search: {value: SymbolPolyfill('search')},
  species: {value: SymbolPolyfill('species')},
  split: {value: SymbolPolyfill('split')},
  toPrimitive: {value: SymbolPolyfill('toPrimitive')},
  toStringTag: {value: SymbolPolyfill('toStringTag')},
  unscopables: {value: SymbolPolyfill('unscopables')}
});

// Internal tweaks for real symbol producer
defineProperties(HiddenSymbol.prototype, {
  constructor: {value: SymbolPolyfill},
  toString: {value: function() {
    return this.__name__;
  }}
});

// Proper implementation of methods exposed on Symbol.prototype
// They won't be accessible on produced symbol instances as they derive from HiddenSymbol.prototype
defineProperties(SymbolPolyfill.prototype, {
  toString: {value: function() {
    return 'Symbol (' + validateSymbol(this).__description__ + ')';
  }},
  valueOf: {value: function() {
    return validateSymbol(this);
  }}
});

defineProperty(SymbolPolyfill.prototype, SymbolPolyfill.toPrimitive, {
  value: function() {
    var symbol = validateSymbol(this);
    if (typeof symbol === 'symbol') return symbol;
    return symbol.toString();
  }
});
defineProperty(SymbolPolyfill.prototype, SymbolPolyfill.toStringTag, {value: 'Symbol'});

// Proper implementaton of toPrimitive and toStringTag for returned symbol instances
defineProperty(HiddenSymbol.prototype, SymbolPolyfill.toStringTag,
  {value: SymbolPolyfill.prototype[SymbolPolyfill.toStringTag]});

// Note: It's important to define `toPrimitive` as last one, as some implementations
// implement `toPrimitive` natively without implementing `toStringTag` (or other specified symbols)
// And that may invoke error in definition flow:
// See: https://github.com/medikoo/es6-symbol/issues/13#issuecomment-164146149
defineProperty(HiddenSymbol.prototype, SymbolPolyfill.toPrimitive,
  {value: SymbolPolyfill.prototype[SymbolPolyfill.toPrimitive]});
