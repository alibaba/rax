// eslint-disable-next-line import/no-extraneous-dependencies
import { isMiniApp, isWeChatMiniProgram, isQuickApp, isByteDanceMicroApp } from 'universal-env';

export default function() {
  // For alibaba miniapp
  if (isMiniApp) {
    return {
      props: {},
      events: {}
    };
  }

  // For wechat miniprogram and bytedance microapp
  if (isWeChatMiniProgram || isByteDanceMicroApp) {
    return {
      properties: {
        __tagId: null,
        ref: null,
        // For native project
        outerProps: null
      },
      options: {
        styleIsolation: 'shared',
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
