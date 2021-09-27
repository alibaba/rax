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
if (typeof ace !== 'undefined') {
  currentDriver = require('./harmony').default;
} else if (isWeex) {
  currentDriver = require('./weex').default;
} else if (isWeb) {
  currentDriver = require('./web').default;
} else if (isKraken) {
  currentDriver = require('./kraken').default;
} else if (isMiniApp || isWeChatMiniProgram || isByteDanceMicroApp || isBaiduSmartProgram || isKuaiShouMiniProgram) {
  currentDriver = require('./miniapp').default;
}

export default currentDriver;
