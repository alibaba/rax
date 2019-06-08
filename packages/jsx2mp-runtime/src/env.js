/* global my */
let warned = false;

export function supportComponent2() {
  if (typeof my === 'undefined') {
    throw new Error('You are not running in miniapp environment.');
  }

  return my.canIUse('component2');
}

export function checkEnv() {
  if (!supportComponent2()) {
    if (warned === false) {
      console.warn(
        'You shall enable component2 to get performance improved! Follow the docs: https://docs.alipay.com/mini/framework/custom-component-overview'
      );
    }
    warned = true;
  }
}
