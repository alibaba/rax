/**
 * lossy : Lossy compression
 * lossless : lossless compression
 * alpha : example png
 * animation : example gif
 */

import { isWeex } from 'universal-env';

let isIOS;
let typeObj = {
  lossy: 'UklGRiIAAABXRUJQVlA4IBYAAAAwAQCdASoBAAEADsD+JaQAA3AAAAAA',
  lossless: 'UklGRhoAAABXRUJQVlA4TA0AAAAvAAAAEAcQERGIiP4HAA==',
  alpha: 'UklGRkoAAABXRUJQVlA4WAoAAAAQAAAAAAAAAAAAQUxQSAwAAAARBxAR/Q9ERP8DAABWUDggGAAAABQBAJ0BKgEAAQAAAP4AAA3AAP7mtQAAAA==',
  animation: 'UklGRlIAAABXRUJQVlA4WAoAAAASAAAAAAAAAAAAQU5JTQYAAAD/////AABBTk1GJgAAAAAAAAAAAAAAAAAAAGQAAABWUDhMDQAAAC8AAAAQBxAREYiI/gcA'
};
if (!isWeex) {
  isIOS = !!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
}

function isSupportTest(callback, type) {
  if ('function' != typeof callback) return;
  let img = new Image;
  img.onload = function() {
    let is = img.width > 0 && img.height > 0;
    setLocalStorage(is, type);
    callback(is);
  }; img.onerror = function() {
    setLocalStorage(false, type);
    callback(false);
  };
}

function setLocalStorage(isSupport, type) {
  if (window.localStorage && typeof window.localStorage.setItem == 'function') {
    try {
      window.localStorage.setItem('webpsupport-' + type, isSupport);
    } catch (e) {
    }
  }
}

function isSupport(callback, type) {
  if (isWeex) {
    return callback(true);
  }
  if ('function' == typeof callback) {
    type = type || 'lossy';

    if (window.navigator.userAgent.match(/windows|win32/i) || isIOS && window.navigator.userAgent.match(/UCBrowser/i)) {
      callback(false);
    } else if (window.chrome || window.opera) {
      callback(true);
    } else {
      let val = window.localStorage && window.localStorage.getItem('webpsupport-' + type);
      if (val) {
        callback(val == 'true');
      } else {
        isSupportTest(callback, type);
      }
    }
  }
}

let Webp = {};
Webp.isSupport = isSupport;
export default Webp;
