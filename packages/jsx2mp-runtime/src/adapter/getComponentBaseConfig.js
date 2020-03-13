// eslint-disable-next-line import/no-extraneous-dependencies
import { isMiniApp, isWeChatMiniProgram } from 'universal-env';

export default function() {
  // For alibaba miniapp
  if (isMiniApp) {
    return {
      props: {},
      events: {}
    };
  }

  // For wechat miniprogram
  if (isWeChatMiniProgram) {
    return {
      properties: {
        __tagId: null,
        ref: null
      },
      options: {
        addGlobalClass: true,
        multipleSlots: true
      }
    };
  }
}
