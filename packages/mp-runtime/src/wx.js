import * as wx from './api';

function createWx(ctx) {
  const _wx = Object.create(wx);
  _wx.context = ctx;
  return _wx;
}

export default createWx;
