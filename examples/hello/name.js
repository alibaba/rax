import { isWeex, isWeb } from 'universal-env';

let name = '';

if (isWeex) {
  name = 'hello weex';
} else {
  name = 'hello world';
}

module.exports = name;