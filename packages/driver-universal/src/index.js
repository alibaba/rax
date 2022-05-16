import {
  isWeex,
  isWeb,
  isMiniApp,
  isWeChatMiniProgram,
  isByteDanceMicroApp,
  isBaiduSmartProgram,
  isKuaiShouMiniProgram
} from 'universal-env';

import driverWeex from './weex';
import driverWeb from './web';
import driverMiniApp from './miniapp';

let currentDriver;
if (isWeex) {
  currentDriver = driverWeex;
} else if (isWeb) {
  currentDriver = driverWeb;
} else if (isMiniApp || isWeChatMiniProgram || isByteDanceMicroApp || isBaiduSmartProgram || isKuaiShouMiniProgram) {
  currentDriver = driverMiniApp;
}

export default currentDriver;
