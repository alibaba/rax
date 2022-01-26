import {
  isWeex,
  isWeb,
  isMiniApp,
  isWeChatMiniProgram,
  isByteDanceMicroApp,
  isBaiduSmartProgram,
  isKuaiShouMiniProgram
} from 'universal-env';

let currentDriver;
if (isWeex) {
  currentDriver = require('./weex').default;
} else if (isWeb) {
  currentDriver = require('./web').default;
} else if (isMiniApp || isWeChatMiniProgram || isByteDanceMicroApp || isBaiduSmartProgram || isKuaiShouMiniProgram) {
  currentDriver = require('./miniapp').default;
}

export default currentDriver;
