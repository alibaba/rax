import nextTick from './nextTick';

const propsMap = {
  // tagId ->
};
const componentIntances = {};


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
