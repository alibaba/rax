import { polyfill as polyfillArrayES7 } from 'runtime-shared/lib/array.es7';
import { polyfill as polyfillObjectES6 } from 'runtime-shared/lib/object.es6';

polyfillArrayES7(Array);
polyfillObjectES6(Object);

// polyfill setPrototypeOf
Object.setPrototypeOf = Object.setPrototypeOf || function(obj, proto) {
  obj.__proto__ = proto;
  return obj;
};
