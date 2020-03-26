/* global TAGID */
import { enqueueRender } from './enqueueRender';
import { getMiniAppHistory } from './history';

// instanceId -> props
const propsMap = {};

// instanceId -> props
const nextPropsMap = {};

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

export function updateChildProps(trigger, instanceId, nextUpdateProps) {
  if (trigger) {
    // Create a new object reference.
    const targetComponent = componentIntances[instanceId];
    if (targetComponent) {
      const nextProps = Object.assign(
        {
          TAGID: instanceId
        },
        targetComponent.props,
        nextUpdateProps
      );
      // Inject history
      if (targetComponent.__injectHistory) {
        const history = getMiniAppHistory();
        Object.assign(nextProps, {
          history,
          location: history.location
        });
      }
      if (targetComponent.__mounted) {
        targetComponent.nextProps = nextPropsMap[instanceId] = nextProps;
        // Ensure parent component did update.
        trigger._pendingCallbacks.push(() => {
          enqueueRender(targetComponent);
        });
      } else {
        targetComponent.props = propsMap[instanceId] = nextProps;
      }
    } else {
      /**
       * updateChildProps may execute  before setComponentInstance
       */
      updateChildPropsCallbacks[instanceId] = updateChildProps.bind(
        null,
        trigger,
        instanceId,
        nextUpdateProps,
      );
    }
  }
}
