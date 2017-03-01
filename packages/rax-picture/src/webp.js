/**
 * alicdn webp支持lossy lossless alpha 
 * lossy 有损压缩
 * lossless 无损压缩 
 * alpha 透明通道 如带透明通道的png
 * animation 动画 如gif
 */

import { isWeex } from 'universal-env';

let isIOS, isTB;
let typeObj = {
  lossy: 'UklGRiIAAABXRUJQVlA4IBYAAAAwAQCdASoBAAEADsD+JaQAA3AAAAAA',
  lossless: 'UklGRhoAAABXRUJQVlA4TA0AAAAvAAAAEAcQERGIiP4HAA==',
  alpha: 'UklGRkoAAABXRUJQVlA4WAoAAAAQAAAAAAAAAAAAQUxQSAwAAAARBxAR/Q9ERP8DAABWUDggGAAAABQBAJ0BKgEAAQAAAP4AAA3AAP7mtQAAAA==',
  animation: 'UklGRlIAAABXRUJQVlA4WAoAAAASAAAAAAAAAAAAQU5JTQYAAAD/////AABBTk1GJgAAAAAAAAAAAAAAAAAAAGQAAABWUDhMDQAAAC8AAAAQBxAREYiI/gcA'
};
if (!isWeex) {
  isIOS = !!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
  isTB = !!navigator.userAgent.match(/windvane/i);
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
      // 浏览器无痕模式/隐私模式或者localStorage已经写满时，写入会失败，虽然setItem函数存在，故用try catch
    }
  }
}

function isSupport(callback, type) {
  if (isWeex) {
    return callback(true);
  }
  if ('function' == typeof callback) {
    type = type || 'lossy';
    /* 
     * 一、ios下的chrome 几点注意
     * 1.明明支持webp的解码，但是用base64的webp图片测试，始终测试不通过，所以ios下的chrome加入白名单
     * 2.window.chrome这个特征检测对ios版下chrome也不生效，为undefind,参考chrome ua string https://developer.chrome.com/multidevice/user-agent 特有CriOS
     * 二、为了尽可能早预判是否支持webp，增加已知的白名单，chrome和opera的低版本不考虑
     * 三、关于webp在手淘的支持情况，手淘ios和android版本都支持webp
     * webview android版本中也支持webp，因为android本身从4.1开始就支持webp，其自带的浏览器默认支持webp
     * 但是webview ios中并不不支持webp，因为safari不支持，目前ios只对native的图片进行了webp解码，
     * 而拦截所有webview中图片请求并webp解码后返回给webview较为复杂，手淘的@贾复正在实现和相关进行性能测试；
     * 手淘如果支持webview的webp，其过程是监听图片请求中的后缀时候有webp，webp从cdn请求回来之后进行webp解码，解码后的图片返回给webview显示。
     * 将来如果手淘支持webview解码webp，组件增加手淘版本判断即可。
     */
    if (window.navigator.userAgent.match(/windows|win32/i) || (isIOS && window.navigator.userAgent.match(/UCBrowser/i))) {
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
