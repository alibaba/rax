const SLOT_KEY = '$slots';
const SCOPED_SLOT_KEY = '$scopedSlots';
function hasOwnProperty(object, prop) {
  return Object.prototype.hasOwnProperty.call(object, prop);
}
/**
 * Render slots.
 * @param viewModel {Object} ViewModel that contains slots.
 * @param slotName {String} Slot name, default to 'default'.
 * @param fallback {?Element[]} Fallback slot element.
 * @param props {?Object} Scoped slot property.
 * @param bindObject {?Object} Only works in SFC, with bind of properties.
 */
export default function renderSlot(viewModel, slotName = 'default', fallback, props, bindObject) {
  const existScopedSlot = hasOwnProperty(viewModel, SCOPED_SLOT_KEY)
    && hasOwnProperty(viewModel[SCOPED_SLOT_KEY], slotName);

  if (existScopedSlot) { // scoped slot
    const scopedSlotFn = viewModel[SCOPED_SLOT_KEY][slotName];
    props = props || {};
    if (bindObject) props = { ...bindObject, ...props };
    return scopedSlotFn(props) || fallback;
  } else {
    return hasOwnProperty(viewModel, SLOT_KEY) && viewModel[SLOT_KEY][slotName] || fallback;
  }
}
