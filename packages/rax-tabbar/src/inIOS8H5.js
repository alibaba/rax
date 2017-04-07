const isWeex = typeof callNative !== 'undefined';

export default function inIOS8H5() {
  let isIn = false;
  if (!isWeex) {
    let r = navigator.userAgent.match(/iphone os ([0-8_]{2})/i);
    if (r && parseInt(r[1]) <= 8) {
      isIn = true;
    }
  }

  if (/Node.js/.test(navigator.userAgent)) {
    return true;
  }

  return isIn;
};