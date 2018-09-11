/**
 * attach argv into process.env
 *
 * @param {object} args commander
 */

module.exports = (args) => {
  const envWhiteList = ['port', 'host', 'https', 'dir', 'debug', 'analyzer'];

  envWhiteList.forEach((key) => {
    if (typeof args[key] !== 'undefined') {
      process.env[key.toLocaleUpperCase()] = args[key];
    }
  });
};
