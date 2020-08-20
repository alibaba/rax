import { isWeex, isWeb, isKraken, isMiniApp, isWeChatMiniProgram } from 'universal-env';
import createDOMDriver from './dom';
import MiniAppDriver from 'driver-miniapp';
import * as WeexDriver from 'driver-weex';
import * as KrakenDriver from 'driver-kraken';

let currentDriver;
if (isWeex) {
  currentDriver = WeexDriver;
} else if (isWeb) {
  currentDriver = createDOMDriver();
} else if (isKraken) {
  currentDriver = KrakenDriver;
} else if (isMiniApp || isWeChatMiniProgram) {
  currentDriver = MiniAppDriver;
} else {
  console.warn('Warning: Your environment was not supported by driver-universal.');
}

export default currentDriver;
