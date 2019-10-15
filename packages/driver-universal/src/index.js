import { isWeex, isWeb } from 'universal-env';

let DriverUniversal;
if (isWeex) {
  DriverUniversal = require('./weex').default;
} else if (isWeb) {
  DriverUniversal = require('./dom').default;
} else {
  throw new Error('Your environment not supported by driver-universal.');
}

export default DriverUniversal;
