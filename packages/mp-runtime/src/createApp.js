let appInstance = null;

class App {
  constructor(config = {}) {
    const app = require('@core/app');

    // copy all config key-value to app
    Object.assign(this, config);

    // lifecycle
    const { onLaunch, onShow, onHide, onError, onPageNotFound } = config;

    const options = {
      query: {}, // TODO: 打开小程序的query
      path: '', // TODO: 打开小程序的路径
    };

    if (typeof onLaunch === 'function') {
      app.on('launch', onLaunch.bind(this, options));
    }

    if (typeof onShow === 'function') {
      app.on('show', onShow.bind(this, options));
    }

    if (typeof onHide === 'function') {
      app.on('hide', onHide.bind(this));
    }
  }
}

export function getApp() {
  return appInstance;
}

export default function createApp(config) {
  if (getApp() !== null) {
    throw new Error('Only one App create allowed per miniapp.');
  }

  return appInstance = new App(config);
}
