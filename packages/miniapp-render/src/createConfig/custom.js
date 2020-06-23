// eslint-disable-next-line import/no-extraneous-dependencies
import { isMiniApp } from 'universal-env';
import createEventProxy from '../bridge/createEventProxy';
import { getComponentLifeCycle } from '../bridge/lifeCycleAdapter';
import cache from '../utils/cache';

function getLatestData(domNode, componentProps) {
  const data = {};
  if (componentProps) {
    for (const name of componentProps) {
      data[name] = domNode.getAttribute(name);
    }
  }
  return data;
}

export default function() {
  const config = {
    data: {
      __ready: false,
    },
  };
  if (!isMiniApp) {
    // For style isolation
    config.options = {
      styleIsolation: 'shared',
    };
    // Define properties in Wechat Miniprogram
    config.properties = {
      r: {
        type: Object,
        value: {},
      },
    };
    config.observers = {
      'r.**': function() {
        // observers Only works in WeChat MiniProgram
        const props = this.properties;
        const config = cache.getConfig();
        const domNode = cache.getNode(props.r.pageId, props.r.nodeId);
        const { props: componentProps } = config[props.r.behavior] || {};
        const data = Object.assign({ __ready: true }, getLatestData(domNode, componentProps));
        this.setData(data);
      }
    };
  }
  Object.assign(
    config,
    getComponentLifeCycle({
      mount() {
        const props = isMiniApp ? this.props : this.properties;
        const config = cache.getConfig();
        const domNode = cache.getNode(props.r.pageId, props.r.nodeId);
        const { props: componentProps, events: componentEvents = [] } = config[props.r.behavior] || {};
        const data = Object.assign({ __ready: true }, getLatestData(domNode, componentProps));

        Object.assign(this, createEventProxy());

        if (componentEvents.length) {
          componentEvents.forEach((eventName) => {
            this[`on${eventName}`] = function(...args) {
              if (isMiniApp) {
                domNode.$$trigger(eventName, { args });
              } else {
                this.callSimpleEvent(eventName, args[0], domNode);
              }
            };
          });
        }

        this.setData(data);
      },
      update() {
        // update method Only works in Alibaba MiniApp
        const props = this.props;
        const config = cache.getConfig();
        const domNode = cache.getNode(props.r.pageId, props.r.nodeId);
        const { props: componentProps } = config[props.r.behavior] || {};
        const data = Object.assign({ __ready: true }, getLatestData(domNode, componentProps));
        this.setData(data);
      }
    })
  );
  return config;
}
