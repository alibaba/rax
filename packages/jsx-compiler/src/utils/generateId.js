let count = 0;

// Generate id selector
module.exports = function() {
  return `id_${count++}`;
};
