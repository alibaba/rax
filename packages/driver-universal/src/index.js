import { isWeex, isWeb } from 'universal-env';
import * as DriverDOM from 'driver-dom';
import * as DriverWeex from 'driver-weex';

let DriverUniversal;
if (isWeex) {
  DriverUniversal = DriverDOM;
} else if (isWeb) {
  DriverUniversal = DriverWeex;
} else {
  throw new Error('Your environment not supported by driver-universal.');
}

export default DriverUniversal;
