import {
  mixinComputed,
  mixinProps,
  mixinSlots,
  mixinData,
  proxy
} from './mixin';

export default class SFC {
  constructor(config) {
    mixinData(this, config);

    debugger
  }
}
