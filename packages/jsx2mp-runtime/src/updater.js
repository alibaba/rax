import nextTick from './nextTick';
import { enqueueRender } from './enqueueRender';

const propsMap = {
  // tagId -> props
};
const componentIntances = {};

const updateChildPropsCallbacks = {};

export function setComponentInstance(instanceId, instance) {
  componentIntances[instanceId] = instance;
  // Check component should update chlid props
  if (updateChildPropsCallbacks[instanceId]) {
    updateChildPropsCallbacks[instanceId]();
    updateChildPropsCallbacks[instanceId] = null;
  }
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
  if (trigger) {
    const targetComponent = componentIntances[instanceId];
    // Create a new object reference.
    if (targetComponent) {
      propsMap[instanceId] = Object.assign(
        {},
        targetComponent.props,
        nextProps,
      );
      nextTick(() => {
        targetComponent.props = propsMap[instanceId];
        enqueueRender(targetComponent);
      });
    } else {
      /**
       * updateChildProps may execute  before setComponentInstance
       */
      updateChildPropsCallbacks[instanceId] = updateChildProps.bind(
        null,
        trigger,
        instanceId,
        nextProps,
      );
    }
  }
}
