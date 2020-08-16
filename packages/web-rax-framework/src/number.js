if (!Number.isNaN) {
  // http://www.ecma-international.org/ecma-262/6.0/#sec-number.isnan
  Number.isNaN = function isNaN(value) {
    return value !== value;
  };
}
