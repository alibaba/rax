import mixinComputed from './mixinComputed';
import mixinProps from './mixinProps';
import mixinData from './mixinData';
import mixinSlots from './mixinSlots';

export { mixinComputed, mixinProps, mixinData, mixinSlots };

export function proxy(source, key, target, targetKey) {
  Object.defineProperty(source, key, {
    enumerable: false,
    configurable: false,
    get: function() {
      return target[targetKey];
    }
  });
}
