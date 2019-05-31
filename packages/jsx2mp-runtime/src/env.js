/* global my */

export function checkEnv() {
  if (typeof my === 'undefined') {
    throw new Error('You are not run in ali miniapp environment.');
  }

  if (!my.canIUse('component2')) {
    console.warn(
      'You should enable component2 with following docs: https://docs.alipay.com/mini/framework/custom-component-overview'
    );
  }
}
