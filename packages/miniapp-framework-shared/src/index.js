import { log, debug } from './logger';
import global from './global';
import decycle from './decycle';
import retrocycle from './retrocycle';
import * as pageHub from './worker/pageHub';
import * as clientHub from './worker/clientHub';
import * as plugin from './worker/plugin';

const worker = {
  pageHub,
  clientHub,
  plugin,
};

export {
  global,
  decycle,
  retrocycle,

  worker,

  log,
  debug,
};
