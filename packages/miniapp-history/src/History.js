import { push, replace, go, goBack, canGo, goForward, __updateRouterMap } from './router';
import Location from './Location';

export default class MiniAppHistory {
  constructor(routes) {
    this.location = new Location();
    __updateRouterMap(routes);
    // Apply actions for history.
    Object.assign(this, { push, replace, goBack, go, canGo, goForward });
  }

  get length() {
    // eslint-disable-next-line no-undef
    return getCurrentPages().length;
  }
}
