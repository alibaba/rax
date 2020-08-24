// eslint-disable-next-line import/no-extraneous-dependencies
import { isMiniApp } from 'universal-env';
import { NATIVE_EVENTS_LIST } from '../constants';

function createLifeCycleCallback(lifeCycle) {
  if (lifeCycle === 'onShareAppMessage') {
    return function(options) {
      if (this.window) {
        const shareInfo = {};
        const returnedShareInfo = this.window.$$trigger('onShareAppMessage', {
          event: { options, shareInfo }
        });
        return returnedShareInfo || shareInfo.content;
      }
    };
  }
  return function(event) {
    if (this.window) {
      this.window.$$trigger(lifeCycle, { event });
    }
  };
}

export default function(lifeCycles, config) {
  lifeCycles.forEach(lifeCycle => {
    if (!['onLoad', 'onShow', 'onHide', 'onUnload'].includes(lifeCycle)) {
      if (isMiniApp && NATIVE_EVENTS_LIST.includes(lifeCycle)) {
        if (!config.events) {
          config.events = {};
        }
        // Define special lifecycle in config's events
        config.events[lifeCycle] = createLifeCycleCallback(lifeCycle);
      } else {
        config[lifeCycle] = createLifeCycleCallback(lifeCycle);
      }
    }
  });
}
