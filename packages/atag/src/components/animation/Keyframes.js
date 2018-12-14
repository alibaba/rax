import { vec3, range, lerpValues } from './helpers';
import { parseEasingFunction } from './eases';

export default class Keyframes {
  constructor(keyframeList, easing) {
    this.keyframeList = keyframeList || [];
    this.easing = easing;
  }

  next(time) {
    return this.keyframeList.find((item) => {
      return time < item.time;
    });
  }

  previous(time) {
    return this.keyframeList.find((item) => {
      return time > item.time;
    });
  }

  ease(name, t) {
    name = name || this.easing;
    return parseEasingFunction(name)(t);
  }

  value(time) {
    let interpolation = this.interpolation(time);
    let startIndex = interpolation[0];
    let nextIndex = interpolation[1];
    let t = interpolation[2];

    if (startIndex === -1 || nextIndex === -1) {
      return null;
    }

    let start = this.keyframeList[startIndex];
    let end = this.keyframeList[nextIndex];

    if (startIndex === nextIndex) {
      return start.value;
    } else {
      let easeName = end.ease;
      t = this.ease(easeName, t);
      return lerpValues(start.value, end.value, t);
    }
  }

  interpolation(time) {
    if (this.keyframeList.length === 0) {
      return [-1, -1, 0];
    }

    let prev = -1;
    // get last keyframe to time
    for (let i = this.keyframeList.length - 1; i >= 0; i--) {
      if (time >= this.keyframeList[i].time) {
        prev = i;
        break;
      }
    }
    if (prev === -1 || prev === this.keyframeList.length - 1) {
      if (prev < 0) {
        prev = 0;
      }
      return vec3(prev, prev, 0);
    } else {
      const startFrame = this.keyframeList[prev];
      const endFrame = this.keyframeList[prev + 1];

      time = Math.max(startFrame.time, Math.min(time, endFrame.time));
      const t = range(startFrame.time, endFrame.time, time);

      return vec3(prev, prev + 1, t);
    }
  }

  clear() {
    this.keyframeList.length = [];
  }
}