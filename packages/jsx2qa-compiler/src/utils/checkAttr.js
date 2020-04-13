const isDirectiveAttr = attr => /^(a:|wx:|x-)/.test(attr);
const isEventHandlerAttr = propKey => /^on[A-Z]/.test(propKey);
const BINDING_REG = /{{|}}/g;

module.exports = {
  isDirectiveAttr,
  isEventHandlerAttr,
  BINDING_REG
};
