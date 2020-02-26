import { isQuickapp } from 'universal-env';
import createRef from '../createRef';

export default function(initialValue) {
  if (isQuickapp) {
    return this._internal.$element(name) || {};
  } else {
    const hookID = this.getHookID();
    const hooks = this.getHooks();

    if (!hooks[hookID]) {
      // this._internal.,
      hooks[hookID] = createRef(initialValue);
    }

    return hooks[hookID];
  }
}
