// https://github.com/WebReflection/url-search-params

const
  find = /[!'\(\)~]|%20|%00/g,
  plus = /\+/g,
  replace = {
    '!': '%21',
    "'": '%27',
    '(': '%28',
    ')': '%29',
    '~': '%7E',
    '%20': '+',
    '%00': '\x00'
  },
  replacer = function(match) {
    return replace[match];
  },
  iterable = isIterable(),
  secret = '__URLSearchParams__'
  ;

function encode(str) {
  return encodeURIComponent(str).replace(find, replacer);
}

function decode(str) {
  return decodeURIComponent(str.replace(plus, ' '));
}

function isIterable() {
  try {
    return !!Symbol.iterator;
  } catch (error) {
    return false;
  }
}

class URLSearchParams {
  constructor(query) {
    this[secret] = Object.create(null);
    if (!query) return;
    if (query.charAt(0) === '?') {
      query = query.slice(1);
    }
    for (var
      index, value,
      pairs = (query || '').split('&'),
      i = 0,
      length = pairs.length; i < length; i++
    ) {
      value = pairs[i];
      index = value.indexOf('=');
      if (-1 < index) {
        this.append(
          decode(value.slice(0, index)),
          decode(value.slice(index + 1))
        );
      } else if (value.length) {
        this.append(
          decode(value),
          ''
        );
      }
    }
  }

  append(name, value) {
    var dict = this[secret];
    if (name in dict) {
      dict[name].push('' + value);
    } else {
      dict[name] = ['' + value];
    }
  }

  delete(name) {
    delete this[secret][name];
  }

  get(name) {
    var dict = this[secret];
    return name in dict ? dict[name][0] : null;
  }

  getAll(name) {
    var dict = this[secret];
    return name in dict ? dict[name].slice(0) : [];
  }

  has(name) {
    return name in this[secret];
  }

  set(name, value) {
    this[secret][name] = ['' + value];
  }

  forEach(callback, thisArg) {
    var dict = this[secret];
    Object.getOwnPropertyNames(dict).forEach(function(name) {
      dict[name].forEach(function(value) {
        callback.call(thisArg, value, name, this);
      }, this);
    }, this);
  }

  keys() {
    var items = [];
    this.forEach(function(value, name) {
      items.push(name);
    });
    var iterator = {
      next: function() {
        var value = items.shift();
        return {done: value === undefined, value: value};
      }
    };

    if (iterable) {
      iterator[Symbol.iterator] = function() {
        return iterator;
      };
    }

    return iterator;
  }

  values() {
    var items = [];
    this.forEach(function(value) {
      items.push(value);
    });
    var iterator = {
      next: function() {
        var value = items.shift();
        return {done: value === undefined, value: value};
      }
    };

    if (iterable) {
      iterator[Symbol.iterator] = function() {
        return iterator;
      };
    }

    return iterator;
  }

  entries() {
    var items = [];
    this.forEach(function(value, name) {
      items.push([name, value]);
    });
    var iterator = {
      next: function() {
        var value = items.shift();
        return {done: value === undefined, value: value};
      }
    };

    if (iterable) {
      iterator[Symbol.iterator] = function() {
        return iterator;
      };
    }

    return iterator;
  }

  toString() {
    var dict = this[secret], query = [], i, key, name, value;
    for (key in dict) {
      name = encode(key);
      for (
        i = 0,
        value = dict[key];
        i < value.length; i++
      ) {
        query.push(name + '=' + encode(value[i]));
      }
    }
    return query.join('&');
  }
}

if (iterable) {
  URLSearchParams.prototype[Symbol.iterator] = URLSearchParams.prototype.entries;
}

module.exports = URLSearchParams;
