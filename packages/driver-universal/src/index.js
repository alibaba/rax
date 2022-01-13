import {
  isWeex,
  isWeb,
  isKraken,
  isMiniApp,
  isWeChatMiniProgram,
  isByteDanceMicroApp,
  isBaiduSmartProgram,
  isKuaiShouMiniProgram
} from 'universal-env';

let currentDriver;
if (isWeex) {
  currentDriver = require('./weex').default;
} else if (isWeb || isKraken) {
  currentDriver = require('./web').default;
} else if (isMiniApp || isWeChatMiniProgram || isByteDanceMicroApp || isBaiduSmartProgram || isKuaiShouMiniProgram) {
  currentDriver = require('./miniapp').default;
}

export default currentDriver;
