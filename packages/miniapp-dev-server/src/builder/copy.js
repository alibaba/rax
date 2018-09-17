const { readFileSync, writeFileSync } = require('fs');

/**
 * copy a file to anthoer place
 * @param {String} from path of file need be copied
 * @param {String} to path of destnation file
 */
module.exports = function copy(from, to) {
  writeFileSync(
    to,
    readFileSync(from)
  );
}
