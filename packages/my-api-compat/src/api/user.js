import WopcMtopPlugin from '@core/WopcMtopPlugin';
import { callWithCallback } from '../util';

export function getAuthUserInfo(options) {
  callWithCallback(WopcMtopPlugin.request, options, {
    api: 'mtop.taobao.openlink.openinfo.user.get',
    v: '1.0',
    type: 'GET'
  }, res => {
    return {
      nickName: res.mixNick,
      userId: res.openId
    };
  });
}
