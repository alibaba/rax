/**
 * Convert single config to multiple platform configs into webpack MultipleCompiler
 * Added platform-loader to module.preLoader
 */

import cloneDeep from 'lodash.clonedeep';

const platformLoader = require.resolve('./PlatformLoader');

module.exports = function MultiplePlatform(config, options = {}) {
  if (Object.prototype.toString.call(config) !== '[object Object]') {
    throw new TypeError('Invalid argument: config, must be an object');
  }

  if (Object.prototype.toString.call(options) !== '[object Object]') {
    throw new TypeError('Invalid argument: options, must be an object');
  }

  let platforms = options.platforms || config.platforms;

  if (typeof platforms === 'undefined' || platforms.length === 0) {
    console.log('');
    console.warn('The \`platforms\` field is not specified!');
    console.log('');
    return config;
  }

  const platformWihteList = ['web', 'node', 'weex', 'reactnative'];

  // filter platforms by platformWihteList
  platforms = platforms.filter(platform => {
    let p = platform.toLowerCase();
    if (platformWihteList.indexOf(p) !== -1) {
      return true;
    }
    return false;
  });

  if (platforms.length === 0) {
    console.log('');
    console.warn('The options.platforms is no available platform!');
    console.warn('Accept platform list:', JSON.stringify(platformWihteList));
    console.log('');
    return config;
  }

  const multiplePlatformConfigs = [];
  let entry = config.entry;

  if (Array.isArray(entry) || typeof entry === 'string') {
    // TODO: support entry pass array/string ?
  } else if (typeof entry === 'object') {
    const entries = Object.keys(entry);

    platforms.forEach(platform => {
      const platformType = platform.toLowerCase();
      let platformConfig = cloneDeep(config);
      let platformEntry = {};
      let nameQuery = '';
      // append platform entry
      entries.forEach(name => {
        if (Array.isArray(entry[name])) {
          platformEntry[`${name}.${platformType}`] = entry[name].map(ev => {
            return `${ev}`;
          });
        } else if (typeof entry[name] === 'string') {
          platformEntry[`${name}.${platformType}`] = `${entry[name]}`;
        }
      });

      platformConfig.entry = platformEntry;
      platformConfig.name = platformType;

      // support chunkFilename config according to platformType
      if (typeof options.chunkFilename === 'function') {
        platformConfig.output.chunkFilename = options.chunkFilename(platformType);
      }

      if (Array.isArray(options.name)) {
        options.name.map(name => {
          nameQuery += '&name[]=' + name;
        });
      }

      if (Array.isArray(platformConfig.module.preLoaders)) {
        platformConfig.module.preLoaders.push({
          test: /\.jsx?$/,
          exclude: options.exclude ? options.exclude : /(node_modules|bower_components)/,
          loader: `${platformLoader}?platform=${platformType}${nameQuery}`
        });
      } else if (typeof platformConfig.module.preLoaders === 'undefined') {
        platformConfig.module.preLoaders = [{
          test: /\.jsx?$/,
          exclude: options.exclude ? options.exclude : /(node_modules|bower_components)/,
          loader: `${platformLoader}?platform=${platformType}${nameQuery}`
        }];
      }

      multiplePlatformConfigs.push(platformConfig);
    });
  }

  multiplePlatformConfigs.unshift(config);

  return multiplePlatformConfigs;
};
