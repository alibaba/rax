/* global getApp, Page */
/* eslint-disable new-cap */
const app = getApp();

Page({
  onLoad() {
    console.log(app.isReady);
    this.setData({ state: 'loaded' });
  },
  data: {
    state: 'loading',
  },
});
