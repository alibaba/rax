/**
 * https://developers.weixin.qq.com/miniprogram/dev/component/official-account.html
 */
export default {
  properties: [],
  handles: {
    onOfficialAccountLoad(evt) {
      this.callSimpleEvent('load', evt);
    },

    onOfficialAccountError(evt) {
      this.callSimpleEvent('error', evt);
    },
  },
};
