const RAX_STATICS = {
  childContextTypes: true,
  contextTypes: true,
  defaultProps: true,
  displayName: true,
  propTypes: true,
  type: true
};

const KNOWN_STATICS = {
  name: true,
  length: true,
  prototype: true,
  caller: true,
  arguments: true,
  arity: true
};

export function hoistNonReactStatics(targetComponent, sourceComponent) {
  if (typeof sourceComponent !== 'string') {
    var keys = Object.getOwnPropertyNames(sourceComponent);
    for (var i = 0; i < keys.length; ++i) {
      if (!RAX_STATICS[keys[i]] && !KNOWN_STATICS[keys[i]]) {
        try {
          targetComponent[keys[i]] = sourceComponent[keys[i]];
        } catch (error) {

        }
      }
    }
  }

  return targetComponent;
}