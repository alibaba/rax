/**
 * Not support:
 * 1. weixin component moved lifecycle
 */

export default function(ctx, config, type = 'ali') {
  switch (type) {
    case 'weixin':
      return {
        _constructor() {
          if (config.lifetimes && isFunction(config.lifetimes.created)) {
            return config.lifetimes.created.call(ctx);
          } else if (isFunction(config.created)) {
            return config.created.call(ctx);
          }
        },
        componentWillMount() {
          if (config.lifetimes && isFunction(config.lifetimes.attached)) {
            return config.lifetimes.attached.call(ctx);
          } else if (isFunction(config.attached)) {
            return config.attached.call(ctx);
          }
        },
        componentDidMount() {
          if (config.lifetimes && isFunction(config.lifetimes.ready)) {
            return config.lifetimes.ready.call(ctx);
          } else if (isFunction(config.ready)) {
            return config.ready.call(ctx);
          }
        },
        componentDidUnmount() {
          if (config.lifetimes && isFunction(config.lifetimes.detached)) {
            return config.lifetimes.detached.call(ctx);
          } else if (isFunction(config.detached)) {
            return config.detached.call(ctx);
          }
        }
      };
    case 'ali':
    default:
      return {
        _constructor() {
          if (isFunction(config.onInit)) {
            return config.onInit.call(ctx);
          }
        },
        componentWillMount(nextProps) {
          if (isFunction(config.deriveDataFromProps)) {
            return config.deriveDataFromProps.call(ctx, nextProps);
          }
        },
        componentDidMount() {
          if (isFunction(config.didMount)) {
            return config.didMount.call(ctx);
          }
        },
        componentWillUpdate(nextProps) {
          if (isFunction(config.deriveDataFromProps)) {
            return config.deriveDataFromProps.call(ctx, nextProps);
          }
        },
        componentDidUpdate(prevProps, prevState) {
          if (isFunction(config.didUpdate)) {
            return config.didUpdate.call(ctx, prevProps, prevState);
          }
        },
        componentWillReceiveProps(nextProps) {
          if (isFunction(config.deriveDataFromProps)) {
            return config.deriveDataFromProps.call(ctx, nextProps);
          }
        },
        componentWillUnmount() {
          if (isFunction(config.didUnmount)) {
            return config.didUnmount.call(ctx);
          }
        }
      };
  }
};

function isFunction(func) {
  return typeof func === 'function';
}
