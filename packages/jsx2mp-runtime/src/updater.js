import nextTick from './nextTick';
import { enqueueRender } from './enqueueRender';

const propsMap = {
  // instanceId -> props
};

const nextPropsMap = {
  // instanceId -> props
};
const componentIntances = {};

const updateChildPropsCallbacks = {};

export function setComponentInstance(instance) {
  const instanceId = instance.instanceId;
  componentIntances[instanceId] = instance;
  // Check component should update chlid props
  if (updateChildPropsCallbacks[instanceId]) {
    updateChildPropsCallbacks[instanceId]();
    updateChildPropsCallbacks[instanceId] = null;
  }
}

export function setComponentProps(instanceId) {
  if (nextPropsMap.hasOwnProperty(instanceId)) {
    propsMap[instanceId] = nextPropsMap[instanceId];
  }
}

export function getComponentProps(instanceId) {
  if (propsMap.hasOwnProperty(instanceId)) return propsMap[instanceId];
  else return null;
}

export function removeComponentProps(instanceId) {
  if (propsMap.hasOwnProperty(instanceId)) {
    delete propsMap[instanceId];
  }
}

export function updateChildProps(trigger, instanceId, nextProps) {
  if (trigger) {
    // Create a new object reference.
    const targetComponent = componentIntances[instanceId];
    // Ensure component __mountComponent method has been called.
    if (targetComponent) {
      targetComponent.nextProps = nextProps[instanceId] = Object.assign(
        {
          __parentId: trigger.props.__tagId,
          __tagId: instanceId
        },
        targetComponent.props,
        nextProps,
      );
      enqueueRender(targetComponent);
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
