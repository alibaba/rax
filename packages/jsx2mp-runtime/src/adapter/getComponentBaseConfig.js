// eslint-disable-next-line import/no-extraneous-dependencies
import { isMiniApp, isWeChatMiniProgram, isQuickapp } from 'universal-env';

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
        __parentId: null,
      },
      options: {
        addGlobalClass: true,
      }
    };
  }

  // For quickapp
  if (isQuickapp) {
    return {
      props: ['tagId', 'parentId'],
    };
  }
}
