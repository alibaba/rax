module.exports = function(arr, checkFn) {
  let idx = -1;
  arr.some((item, index) => {
    if (checkFn(item, index)) {
      idx = index;
      return true;
    }
    return false;
  });
  return idx;
};
