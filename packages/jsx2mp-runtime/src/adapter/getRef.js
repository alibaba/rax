// eslint-disable-next-line import/no-extraneous-dependencies
import { isQuickApp } from 'universal-env';
import createRef from '../createRef';

export default function(initialValue) {
  if (isQuickApp) {
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
