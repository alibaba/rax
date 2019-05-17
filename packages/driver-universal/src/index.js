import { isWeex, isWeb } from 'universal-env';
import * as DriverDOM from 'driver-dom';
import * as DriverWeex from 'driver-weex';

let DriverUniversal;
if (isWeex) {
  DriverUniversal = DriverWeex;
} else if (isWeb) {
  DriverUniversal = DriverDOM;
} else {
  throw new Error('Your environment not supported by driver-universal.');
}

export default DriverUniversal;
