import {isWeb} from 'universal-env';

let Picture;
if (isWeb) {
  Picture = require('./picture.web');
} else {
  Picture = require('./picture.weex');
}

export default Picture;
