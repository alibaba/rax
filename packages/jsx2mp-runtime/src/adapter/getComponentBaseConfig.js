// eslint-disable-next-line import/no-extraneous-dependencies
import { isMiniApp, isWeChatMiniProgram } from 'universal-env';
import dutyChain from './dutyChain';

function handleMiniApp() {
  if (isMiniApp) {
    return {
      props: {},
      events: {}
    };
  } return null;
}

function handleWechatMiniProgram() {
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
  } return null;
}

export default function() {
  return dutyChain(handleMiniApp, handleWechatMiniProgram);
}
