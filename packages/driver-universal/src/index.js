import { isWeex, isWeb, isKraken, isMiniApp, isWeChatMiniProgram } from 'universal-env';
import createDOMDriver from './dom';
import * as MiniAppDriver from 'driver-miniapp';
import * as WeexDriver from 'driver-weex';
import createKrakenDriver from 'driver-kraken';

let currentDriver;
if (isWeex) {
  currentDriver = WeexDriver;
} else if (isWeb) {
  currentDriver = createDOMDriver();
} else if (isKraken) {
  currentDriver = createKrakenDriver();
} else if (isMiniApp || isWeChatMiniProgram) {
  currentDriver = MiniAppDriver;
} else {
  throw new Error('Your environment was not supported by driver-universal.');
}

export default currentDriver;
