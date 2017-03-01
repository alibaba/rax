import {isWeb} from 'universal-env';

let Picture;
if (isWeb) {
  Picture = require('./index');
} else {
  Picture = require('./index.native');
}

export default Picture;