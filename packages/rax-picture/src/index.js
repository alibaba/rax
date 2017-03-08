import {isWeb} from 'universal-env';

let Picture;
if (isWeb) {
  Picture = require('./web');
} else {
  Picture = require('./native');
}

export default Picture;