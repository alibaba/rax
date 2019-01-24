const SLOT_KEY = '$slots';
const objectProtoHasOwnProperty = Object.prototype.hasOwnProperty;
function hasOwnProperty(object, prop) {
  return objectProtoHasOwnProperty.call(object, prop);
}

/**
 * Render slots.
 * @param viewModel {Object} ViewModel that contains slots.
 * @param slotName {String} Slot name, default to 'default'.
 * @param defaultSlot {Element} Default slot element.
 */
export default function renderSlot(viewModel, slotName = 'default', defaultSlot) {
  return viewModel && hasOwnProperty(viewModel, SLOT_KEY) && hasOwnProperty(viewModel[SLOT_KEY], slotName)
    ? viewModel[SLOT_KEY][slotName]
    : defaultSlot;
}
