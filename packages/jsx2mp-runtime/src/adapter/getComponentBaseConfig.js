// eslint-disable-next-line import/no-extraneous-dependencies
import { isMiniApp, isWeChatMiniProgram, isQuickApp } from 'universal-env';

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
        ref: null,
        // For native project
        outerProps: null
      },
      options: {
        addGlobalClass: true,
        multipleSlots: true
      }
    };
  }

  // For quickapp
  if (isQuickApp) {
    return {
      props: ['tagId'],
    };
  }
}
