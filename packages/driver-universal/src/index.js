import { isWeex, isWeb } from 'universal-env';
import DriverDOM from './dom';
import DriverWeex from './weex';

let DriverUniversal;
if (isWeex) {
  DriverUniversal = DriverWeex;
} else if (isWeb) {
  DriverUniversal = DriverDOM;
} else {
  throw new Error('Your environment not supported by driver-universal.');
}

export default DriverUniversal;
