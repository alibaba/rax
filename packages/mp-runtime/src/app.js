let appInstance = null;

export function getApp() {
  return appInstance;
}

class App {
  constructor(config = {}) {
    const app = require('@core/app');

    // copy all config key (my)
    // including globalData (wx)
    Object.keys(config).forEach(key => {
      const val = config[key];
      this[key] = val;
    });

    // lifecycle
    const { onLaunch, onShow, onHide, onError } = config;
    // not supported yet
    const opts = {
      query: {},
      path: ''
    };
    if (typeof onLaunch === 'function') {
      app.on('launch', onLaunch.bind(this, opts));
    }
    if (typeof onShow === 'function') {
      app.on('show', onShow.bind(this, opts));
    }
    if (typeof onHide === 'function') {
      app.on('hide', onHide.bind(this));
    }
    /**
     * error cycle not support in android
     */
    // if (typeof onError === 'function') {
    //   app.on('error', onError.bind(this));
    // }
  }
}

export default function initApp(config = {}) {
  if (getApp() !== null) {
    throw new Error('App only can be init once');
  }

  const app = new App(config);
  return appInstance = app;
}
initApp.getApp = getApp;
