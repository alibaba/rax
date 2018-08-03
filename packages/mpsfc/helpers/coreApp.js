const cycle = {
  launch: 'onLaunch',
  show: 'onShow',
  hide: 'onHide',
  error: 'onError',
};

const app = {};
app.on = function(key, fn) {
  app[cycle[key] || key] = fn;
};
app.getApp = () => app;

module.exports = app;
