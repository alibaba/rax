if (process.env.NODE_ENV === 'production') {
  module.exports = require('./dist/rax.min.js');
} else {
  module.exports = require('./dist/rax.js');
}
