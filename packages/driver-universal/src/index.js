import { isWeex, isWeb, isKraken } from 'universal-env';
import DriverDOM from './dom';
import DriverWeex from './weex';
import DriverKraken from './kraken';

let DriverUniversal;
if (isWeex) {
  DriverUniversal = DriverWeex;
} else if (isWeb) {
  DriverUniversal = DriverDOM;
} else if (isKraken) {
  DriverUniversal = DriverKraken;
} else {
  throw new Error('Your environment not supported by driver-universal.');
}

export default DriverUniversal;
