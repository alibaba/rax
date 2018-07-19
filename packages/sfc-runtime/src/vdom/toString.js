module.exports = function(val) {
  if (val === undefined || val === null) {
    return '';
  } else {
    return typeof val === 'object'
      ? JSON.stringify(val, null, 2)
      : '' + val;
  }
};
