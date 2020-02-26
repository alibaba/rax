// eslint-disable-next-line import/no-extraneous-dependencies
import { isQuickapp } from 'universal-env';

export default function(name, method) {
  if (isQuickapp) {
    setTimeout(() => {
      Object.assign(method, {
        current: this._internal.$element(name)
      });
    }, 0);
  } else {
    if (!method) {
      const target = {
        current: null
      };
      this._internal[name] = ref => {
        target.current = ref;
      };
      this.refs[name] = target;
    } else {
      this._internal[name] = method;
      this.refs[name] = method;
    }
  }
}
