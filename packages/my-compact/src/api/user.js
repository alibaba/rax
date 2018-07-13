import user from '@core/user'
import { callWithCallback } from '../util'

export function getAuthUserInfo (options) {
  callWithCallback(user.info, options, {}, res => {
    return {
      nickName: res.nick,
      userId: res.userId
    }
  })
}
