/* global WXEnvironment */

import semver from './semver';

function normalizeVersion(v) {
  if (v == '*') {
    return v;
  }
  v = typeof v === 'string' ? v : '';
  let split = v.split('.');
  let i = 0;
  let result = [];

  while (i < 3) {
    let s = typeof split[i] === 'string' && split[i] ? split[i] : '0';
    result.push(s);
    i++;
  }

  return result.join('.');
}

function getError(key, val, criteria) {
  let result = {
    isDowngrade: true,
    errorType: 1,
    code: 1000
  };
  let getMsg = function(key, val, criteria) {
    return 'Downgrade[' + key + '] :: deviceInfo '
      + val + ' matched criteria ' + criteria;
  };
  let _key = key.toLowerCase();

  if (_key.indexOf('osversion') >= 0) {
    result.code = 1001;
  } else if (_key.indexOf('appversion') >= 0) {
    result.code = 1002;
  } else if (_key.indexOf('weexversion') >= 0) {
    result.code = 1003;
  } else if (_key.indexOf('devicemodel') >= 0) {
    result.code = 1004;
  }

  result.errorMessage = getMsg(key, val, criteria);
  return result;
}

/**
 * config
 *
 * {
 *   ios: {
 *     osVersion: '>1.0.0' or '>=1.0.0' or '<1.0.0' or '<=1.0.0' or '1.0.0'
 *     appVersion: '>1.0.0' or '>=1.0.0' or '<1.0.0' or '<=1.0.0' or '1.0.0'
 *     weexVersion: '>1.0.0' or '>=1.0.0' or '<1.0.0' or '<=1.0.0' or '1.0.0'
 *     deviceModel: ['modelA', 'modelB', ...]
 *   },
 *   android: {
 *     osVersion: '>1.0.0' or '>=1.0.0' or '<1.0.0' or '<=1.0.0' or '1.0.0'
 *     appVersion: '>1.0.0' or '>=1.0.0' or '<1.0.0' or '<=1.0.0' or '1.0.0'
 *     weexVersion: '>1.0.0' or '>=1.0.0' or '<1.0.0' or '<=1.0.0' or '1.0.0'
 *     deviceModel: ['modelA', 'modelB', ...]
 *   }
 * }
 *
 */
function check(config) {
  let result = {
    isDowngrade: false
  };

  let deviceInfo = WXEnvironment;

  let platform = deviceInfo.platform || 'unknow';
  let dPlatform = platform.toLowerCase();
  let cObj = config[dPlatform] || {};

  for (let i in deviceInfo) {
    let key = i;
    let keyLower = key.toLowerCase();
    let val = deviceInfo[i];
    let isVersion = keyLower.indexOf('version') >= 0;
    let isDeviceModel = keyLower.indexOf('devicemodel') >= 0;
    let criteria = cObj[i];

    if (criteria && isVersion) {
      let c = normalizeVersion(criteria);
      let d = normalizeVersion(deviceInfo[i]);

      if (semver.satisfies(d, c)) {
        result = getError(key, val, criteria);
        break;
      }
    } else if (isDeviceModel) {
      let _criteria = Array.isArray(criteria) ? criteria : [criteria];

      if (_criteria.indexOf(val) >= 0) {
        result = getError(key, val, criteria);
        break;
      }
    }
  }

  return result;
}

module.exports = function(__weex_require__) {
  return (config) => {
    let nativeInstanceWrap = __weex_require__('@weex-module/instanceWrap');
    let result = check(config);
    if (result.isDowngrade) {
      nativeInstanceWrap.error(
        result.errorType,
        result.code,
        result.errorMessage
      );
      return true;
    }
    return false;
  };
};
