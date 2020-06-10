// eslint-disable-next-line import/no-extraneous-dependencies
import { isMiniApp } from 'universal-env';
import createEventProxy from '../bridge/createEventProxy';
import { getComponentLifeCycle } from '../bridge/lifeCycleAdapter';
import cache from '../utils/cache';

export default function() {
  const config = {
    data: {
      __ready: false
    },
  };
  if (!isMiniApp) {
    // For style isolation
    config.options = {
      styleIsolation: 'shared'
    };
    // Define properties in Wechat Miniprogram
    config.properties = {
      r: {
        type: Object,
        value: {}
      },
    };
  }
  Object.assign(config, getComponentLifeCycle({
    mount() {
      let props;
      if (!isMiniApp) {
        props = this.properties;
      } else {
        props = this.props;
      }
      const data = { __ready: true };
      const config = cache.getConfig();
      const { props: componentProps, events: componentEvents = [] } =
      config.nativeCustomComponent &&
        config.nativeCustomComponent.usingComponents &&
        config.nativeCustomComponent.usingComponents[props.r.behavior] ||
      {};
      const domNode = cache.getNode(props.r.pageId, props.r.nodeId);
      if (componentProps) {
        for (const name of componentProps) {
          data[name] = domNode.getAttribute(name);
        }
      }

      Object.assign(this, createEventProxy());

      if (componentEvents.length) {
        componentEvents.forEach(eventName => {
          this[`on${eventName}`] = function(evt) {
            this.callSimpleEvent(eventName, evt, domNode);
          };
        });
      }

      this.setData(data);
    }
  }));
  return config;
}