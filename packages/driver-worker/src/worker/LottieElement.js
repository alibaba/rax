import { mutate } from './MutationObserver';
import Element from './Element';

const methods = [
  'play',
  'stop',
  'pause',
  'setSpeed',
  'goToAndStop',
  'goToAndPlay',
  'getDuration',
  'setDirection',
  'playSegments',
  'playFromMinToMaxProgress',
  'playFromMinToMaxFrame',
  'destroy'
];

export default class LottieElement extends Element {
  constructor(...args) {
    super(...args);

    methods.forEach(method => {
      this[method] = (...args) => {
        mutate(this, 'lottieRenderingContext', {
          method: method,
          args: args
        });
      };
    });
  }
}
