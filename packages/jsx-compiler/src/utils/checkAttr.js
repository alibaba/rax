const isDirectiveAttr = attr => /^(a:|wx:|x-)/.test(attr);
const isEventHandlerAttr = propKey => /^on[A-Z]/.test(propKey) || /^bind[a-z:]/.test(propKey) || /^catch[a-z:]/.test(propKey);
const isRenderPropsAttr = propKey => /^render[A-Z]/.test(propKey);
const BINDING_REG = /{{|}}/g;

module.exports = {
  isDirectiveAttr,
  isEventHandlerAttr,
  isRenderPropsAttr,
  BINDING_REG
};
