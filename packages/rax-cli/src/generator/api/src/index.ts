import { isWeex, isMiniApp } from 'universal-env';

let func: () => Promise<any>;

if (isWeex) {
  func = require('./weex').default;
} else if (isMiniApp) {
  func = require('./miniapp').default;
} else {
  func = require('./web').default;
}

export default func;
