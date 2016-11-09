import Animated from './animated';
import {setNativeProps} from 'universal-rx';
import {View, Image, Text, ScrollView} from 'rx-components';
import mapStyle from './mapStyle';

function ApplyAnimatedValues(instance, props) {
  setNativeProps(instance, {
    style: mapStyle(props.style)
  });
}

var injectApplyAnimatedValues = Animated.inject.ApplyAnimatedValues;
injectApplyAnimatedValues(ApplyAnimatedValues);

var RequestAnimationFrame;
var CancelAnimationFrame;

if (typeof requestAnimationFrame !== 'undefined') {
  RequestAnimationFrame = (cb) => requestAnimationFrame(cb);
  CancelAnimationFrame = (id) => cancelAnimationFrame(id);
  // Works around a rare bug in Safari 6 where the first request is never invoked.
  requestAnimationFrame(() => {});
} else {
  var lastTime = 0;
  RequestAnimationFrame = (callback) => {
    var currTime = Date.now();
    var timeDelay = Math.max(0, 16 - (currTime - lastTime));
    lastTime = currTime + timeDelay;
    return setTimeout(() => {
      callback(Date.now());
    }, timeDelay);
  };

  CancelAnimationFrame = (id) => {
    clearTimeout(id);
  };
}

var injectRequestAnimationFrame = Animated.inject.RequestAnimationFrame;
injectRequestAnimationFrame(RequestAnimationFrame);

var injectCancelAnimationFrame = Animated.inject.CancelAnimationFrame;
injectCancelAnimationFrame(CancelAnimationFrame);

export default {
  ...Animated,
  View: Animated.createAnimatedComponent(View),
  Text: Animated.createAnimatedComponent(Text),
  Image: Animated.createAnimatedComponent(Image),
  ScrollView: Animated.createAnimatedComponent(ScrollView),
};
