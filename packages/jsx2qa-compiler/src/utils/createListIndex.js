const t = require('@babel/types');

let listIndexCount = 0;

// Create increasing index node
module.exports = function() {
  return t.identifier('index' + listIndexCount++);
};
