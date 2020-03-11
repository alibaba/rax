// eslint-disable-next-line import/no-extraneous-dependencies
import { isMiniApp, isWeChatMiniProgram } from 'universal-env';

export default function(initialValue) {
  let created = false;
  const ref = {
    current: initialValue
  };
  const refFn = (instance) => {
    // Instance maybe component instance or triggered event object
    if (!created || instance.detail) {
      if (isMiniApp) {
        ref.current = instance;
      } else if (isWeChatMiniProgram) {
        // If instance has detail, instance is event object
        ref.current = instance.detail ? instance.detail : instance;
      }
    }
    created = true;
  };
  refFn.__proto__ = ref;
  return refFn;
};
