// Simple version of https://github.com/mridgway/hoist-non-react-statics/blob/master/src/index.js

const REACT_STATICS = {
  childContextTypes: true,
  contextType: true,
  contextTypes: true,
  defaultProps: true,
  displayName: true,
  getDefaultProps: true,
  // getDerivedStateFromError: true,
  // getDerivedStateFromProps: true,
  propTypes: true,
  type: true
};

const KNOWN_STATICS = {
  name: true,
  length: true,
  prototype: true,
  caller: true,
  callee: true,
  arguments: true,
  arity: true
};

export default function hoistNonReactStatics(targetComponent, sourceComponent) {
  if (typeof sourceComponent !== 'string') { // don't hoist over string (html) components
    let keys = Object.getOwnPropertyNames(sourceComponent);

    for (let i = 0; i < keys.length; ++i) {
      const key = keys[i];
      if (!KNOWN_STATICS[key] &&
          !REACT_STATICS[key] &&
          !targetComponent[key]
      ) {
        targetComponent[key] = sourceComponent[key];
      }
    }
  }
  return targetComponent;
}
