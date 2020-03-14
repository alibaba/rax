// eslint-disable-next-line import/no-extraneous-dependencies
import { isQuickApp } from 'universal-env';
import apiCore from './getNativeAPI';

export default function(name, method, type, id) {
  if (isQuickApp) {
    setTimeout(() => {
      Object.assign(method, {
        current: this._internal.$element(name)
      });
    }, 0);
  } else {
    if (type === 'component') {
      this._internal[name] = method;
      if (this._internal.selectComponent) {
        const instance = this._internal.selectComponent(`#${id}`);
        this.refs[name] = {
          current: instance
        };
        method(instance, true);
      } else {
        this.refs[name] = method;
      }
    } else {
      const instance = apiCore.createSelectorQuery().select(`#${id}`);
      this.refs[name] = {
        current: instance
      };
      method(instance);
    }
  }
}
