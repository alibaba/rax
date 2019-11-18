import nextTick from './nextTick';
import { enqueueRender } from './enqueueRender';

const propsMap = {
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
    const targetComponent = componentIntances[instanceId];
    // Create a new object reference.
    if (targetComponent) {
      propsMap[instanceId] = Object.assign(
        {
          __parentId: trigger.props.__tagId,
          __tagId: instanceId
        },
        targetComponent.props,
        nextProps,
      );
      nextTick(() => {
        targetComponent.nextProps = propsMap[instanceId];
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
