import { requestFrame, cancelFrame, lerpValues, now } from './shared/helpers';
import Keyframes from './Keyframes';

// 时序变化
export default class Timeline {
  constructor(
    data,
    config,
    callbacks = {}
  ) {
    const { onFrame, onFinish } = callbacks;
    this.isPause = false;
    this.startTime = undefined;
    this.lastTimeStamp = -1;
    this.currentTime = 0;
    this.lastTime = -1;
    this.frame = undefined;
    this.currentIterationNumber = 1;
    this.properties = [];

    this.config = config;
    this.onFrame = onFrame;
    this.onFinish = onFinish;

    this.tick = this.tick.bind(this);
    this.update(data, {...config});
  }

  update(data = [], config) {
    this.config = { ...this.config, ...config };
    const {
      direction = 'normal',
      duration = 1000,
      delay = 0,
      easing = 'linear',
      iterations = 1
    } = this.config;
    this.direction = direction;
    this.duration = duration;
    this.delay = delay;
    this.easing = easing;
    this.iterations = iterations;

    this.totalDuration = duration / 1000;

    this.data = this.convertKeyframes(data);
    this.properties = this.getProperties();
  }

  /**
   * 将 web animation keyframes 转换为需要的 keyframes
   * @param {Array} originKeyframes
   */
  convertKeyframes(originKeyframes) {
    const newKeyframes = [];
    const totalLength = originKeyframes.length;

    if (this.direction === 'reverse') {
      originKeyframes.reverse();
    }
    const startKeyframe = originKeyframes[0];
    const endKeyframe = originKeyframes[totalLength - 1];

    if (startKeyframe && !startKeyframe.offset) {
      startKeyframe.offset = 0;
    }
    if (endKeyframe && !endKeyframe.offset) {
      endKeyframe.offset = 1;
    }

    originKeyframes.forEach((item, index) => {
      if (index !== 0 && index !== totalLength - 1 && !item.offset) {
        const beforeOffset = originKeyframes[index - 1].offset;
        const afterExistOffsetIndex = originKeyframes.findIndex((item, _index) => {
          return typeof item.offset !== 'undefined' && _index > index;
        });
        const afterExistOffset = originKeyframes[afterExistOffsetIndex].offset;
        const currentOffset = (afterExistOffset - beforeOffset) / (afterExistOffsetIndex - index + 1) + beforeOffset;
        item.offset = currentOffset;
      }
      Object.keys(item).filter((prop) => {
        // 白名单属性过滤
        return ['offset', 'easing'].indexOf(prop) === -1;
      }).forEach((property) => {
        const existData = newKeyframes.find((newData) => {
          return newData.name === property;
        });
        const keyframe = {
          value: item[property],
          ...this.getKeyframeSpecialValue(item)
        };
        if (existData) {
          existData.keyframes.push(keyframe);
        } else {
          newKeyframes.push({
            name: property,
            keyframes: [keyframe]
          });
        }
      });
    });
    return newKeyframes;
  }

  // 得到 easing、offset 等值
  /**
   * get easing、time from keyframe object
   * @param {keyframe} keyframe object
   */
  getKeyframeSpecialValue(keyframe) {
    const value = {};

    if (keyframe.easing) {
      value.ease = keyframe.easing;
    }
    value.time = keyframe.offset * this.totalDuration;

    return value;
  }

  /**
   * get property list
   */
  getProperties() {
    const properties = [];
    this.data.forEach((item) => {
      properties.push({
        name: item.name,
        keyframe: new Keyframes(item.keyframes, this.easing)
      });
    });
    return properties;
  }

  getValues(time, out) {
    if (!out) {
      out = {};
    }
    this.properties.forEach((prop) => {
      out[prop.name] = prop.keyframe.value(time);
    });

    return out;
  }

  play() {
    if (this.isPause) {
      this.isPause = false;
    } else {
      this.isPlaying = true;
      this.startTime = now();
    }

    this.frame = requestFrame(this.tick);
  }

  cancel() {
    this.reset();
    cancelFrame(this.frame);
  }

  pause() {
    this.isPause = true;
    this.lastTimeStamp = -1;
    cancelFrame(this.frame);
  }

  finish() {
    this.reset();
    this.onFinish && this.onFinish();
    cancelFrame(this.frame);
  }

  reset() {
    this.isPlaying = false;
    this.isPause = false;
    this.currentIterationNumber = 1;
    this.currentTime = 0;
    this.lastTimeStamp = -1;
  }

  tick() {
    const currentTimeStamp = now();

    if (this.isPause) {
      return;
    }

    if (currentTimeStamp - this.startTime >= this.delay) {
      if (this.lastTimeStamp === -1) {
        this.lastTimeStamp = currentTimeStamp;
      }
      const elapsed = (currentTimeStamp - this.lastTimeStamp) / 1000;

      if (this.isPlaying) {
        this.currentTime += elapsed;
        this.currentValue = this.getValues(this.currentTime);
      }

      if (this.currentTime >= this.totalDuration) {
        this.currentTime = this.totalDuration;
        if (this.currentIterationNumber >= this.iterations) {
          this.finish();
        } else {
          this.currentIterationNumber++;
          this.currentTime = 0;
        }
      }

      if (this.isPlaying) {
        this.lastTimeStamp = currentTimeStamp;
        this.lastTime = this.currentTime;
      }
      this.onFrame && this.onFrame(this.currentValue);
    }
    if (!this.isPlaying) {
      return;
    }

    this.frame = requestFrame(this.tick);
  }
}