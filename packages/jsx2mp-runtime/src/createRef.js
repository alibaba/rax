// eslint-disable-next-line import/no-extraneous-dependencies
import { isMiniApp, isWeChatMiniProgram, isByteDanceMicroApp } from 'universal-env';

export default function(initialValue) {
  let created = false;
  const ref = {
    current: initialValue
  };
  const refFn = (instance, canOverride) => {
    // Instance maybe component instance or triggered event object
    if (!created || canOverride) {
      if (isMiniApp) {
        ref.current = instance;
      } else if (isWeChatMiniProgram || isByteDanceMicroApp) {
        // If instance has detail, instance is event object
        ref.current = instance.detail ? instance.detail : instance;
      }
    }
    created = true;
  };
  refFn.__proto__ = ref;
  return refFn;
};
