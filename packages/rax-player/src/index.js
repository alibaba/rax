import {isWeb} from 'universal-env';

let Video;
if (isWeb) {
  Video = require('./video.web');
} else {
  Video = require('./video.weex');
}

export default Video;