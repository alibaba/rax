/* global my */
const nextTick = my.nextTick || setTimeout;
const componentIntances = {};

export function setComponentInstance(instanceId, instance) {
  componentIntances[instanceId] = instance;
}

function getProps(component, propMaps) {
  const props = {};
  for (let prop in propMaps) {
    const key = propMaps[prop];
    props[prop] = component.state[key] || component.props[key];
  }
  return props;
}

my.$updateProps = function(trigger, instanceId, propsFromTrigger) {
  const targetComponent = componentIntances[instanceId];
  if (trigger && targetComponent) {
    nextTick(() => {
      const nextProps = getProps(trigger, propsFromTrigger);
      targetComponent.props = nextProps;
      targetComponent._trigger('render');
      // targetComponent._updateComponent();
    });
  }
};
