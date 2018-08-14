const env = typeof wmlEnv === 'object' ? wmlEnv : {}; // eslint-disable-line

export function getSystemInfoSync() {
  return {
    model: env.model, // 手机型号
    pixelRatio: env.pixelRatio, // 设备像素比
    windowWidth: env.windowWidth, // 窗口宽度
    windowHeight: env.windowHeight, // 窗口高度
    language: env.language, // 支付宝设置的语言
    appName: env.appName, // taobao/alipay
    version: env.appVersion, // 支付宝版本号

    system: env.systemVersion, // 系统版本
    platform: env.platform, // 系统名：Android，iOS
    screeWidth: env.screenWidth, // 屏幕宽度
    screenHeight: env.screenHeight, // 屏幕高度
    brand: env.barnd, // 手机品牌

    storage: null, // 设备磁盘容量
    currentBattery: null, // 当前电量百分比
    fontSizeSetting: 14, // 用户设置字体大小
    frameworkType: env.frameworkType,
    frameworkVersion: env.frameworkVersion,
    userAgent: env.userAgent,
  };
}


export function getSystemInfo(params = {}) {
  try {
    if (typeof params.success === 'function') {
      params.success.call(this, getSystemInfoSync());
    }
  } catch (err) {
    if (typeof params.fail === 'function') {
      params.fail.call(this, err);
    }
  } finally {
    if (typeof params.complete === 'function') {
      params.complete.call(this);
    }
  }
}
