import nextTick from './nextTick';

const propsMap = {
  // tagId -> props
};
const componentIntances = {};

const updateChildPropsCallbacks = [];

export function setComponentInstance(instanceId, instance) {
  componentIntances[instanceId] = instance;
}

export function getComponentProps(tagId) {
  if (propsMap.hasOwnProperty(tagId)) return propsMap[tagId];
  else return null;
}

export function removeComponentProps(tagId) {
  if (propsMap.hasOwnProperty(tagId)) {
    delete propsMap[tagId];
  }
}

export function updateChildProps(trigger, instanceId, nextProps) {
  const targetComponent = componentIntances[instanceId];
  if (trigger) {
    // Create a new object reference.
    if (targetComponent) {
      propsMap[instanceId] = Object.assign(
        {},
        targetComponent.props,
        nextProps,
      );
      nextTick(() => {
        Object.assign(targetComponent.props, propsMap[instanceId]);
        targetComponent._updateComponent();
      });
    } else {
      /**
       * updateChildProps may execute  before setComponentInstance
       */
      updateChildPropsCallbacks.push(
        updateChildProps.bind(null, trigger, instanceId, nextProps),
      );
    }
  }
}

export function executeCallbacks() {
  updateChildPropsCallbacks.forEach(callback => callback());
  updateChildPropsCallbacks.length = 0;
}
