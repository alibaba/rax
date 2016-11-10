function makeEmptyFunction(arg) {
  return function() {
    return arg;
  };
}

const emptyFunction = function() {};

emptyFunction.thatReturns = makeEmptyFunction;
emptyFunction.thatReturnsFalse = makeEmptyFunction(false);
emptyFunction.thatReturnsTrue = makeEmptyFunction(true);
emptyFunction.thatReturnsNull = makeEmptyFunction(null);
emptyFunction.thatReturnsThis = function() {
  return this;
};
emptyFunction.thatReturnsArgument = function(arg) {
  return arg;
};

export default emptyFunction;
