import { isWeex, isWeb, isKraken, isMiniApp, isWeChatMiniProgram, isByteDanceMicroApp } from 'universal-env';
import WebDriver from './web';
import MiniAppDriver from './miniapp';
import * as WeexDriver from './weex';
import * as KrakenDriver from './kraken';

let currentDriver;
if (isWeex) {
  currentDriver = WeexDriver;
} else if (isWeb) {
  currentDriver = WebDriver;
} else if (isKraken) {
  currentDriver = KrakenDriver;
} else if (isMiniApp || isWeChatMiniProgram || isByteDanceMicroApp) {
  currentDriver = MiniAppDriver;
}

export default currentDriver;
