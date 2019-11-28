import { isWeex, isWeb, isKraken } from 'universal-env';
import createDOMDriver from './dom';
import createWeexDriver from './weex';
import createKrakenDriver from 'driver-kraken';

let currentDriver;
if (isWeex) {
  currentDriver = createWeexDriver();
} else if (isWeb) {
  currentDriver = createDOMDriver();
} else if (isKraken) {
  currentDriver = createKrakenDriver();
} else {
  throw new Error('Your environment was not supported by driver-universal.');
}

export default currentDriver;
