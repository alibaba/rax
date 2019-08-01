import nextTick from './nextTick';

const propsMap = {
  // pid ->
};
const componentIntances = {};


export function setComponentInstance(instanceId, instance) {
  componentIntances[instanceId] = instance;
}

export function getComponentProps(pid) {
  if (propsMap.hasOwnProperty(pid)) return propsMap[pid];
  else return null;
}

export function removeComponentProps(pid) {
  if (propsMap.hasOwnProperty(pid)) {
    delete propsMap[pid];
  }
}

function getNextProps(component, propsFromTrigger) {
  const props = {};
  for (let prop in propsFromTrigger) {
    const key = propsFromTrigger[prop];
    if (component.state.hasOwnProperty(prop)) {
      props[prop] = component.state[key];
    } else {
      props[prop] = component.props[key];
    }
  }

  return props;
}

export function updateChildProps(trigger, instanceId, nextProps) {
  const targetComponent = componentIntances[instanceId];
  if (trigger && targetComponent) {
    // Create a new object reference.
    propsMap[instanceId] = targetComponent.props = Object.assign({}, targetComponent.props, nextProps);
    nextTick(() => {
      targetComponent._updateComponent();
    });
  }
}
