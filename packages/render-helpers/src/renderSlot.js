const SLOT_KEY = '$slots';
const SCOPED_SLOT_KEY = '$scopedSlots';

/**
 * Render slots.
 * @param viewModel {Object} ViewModel that contains slots.
 * @param slotName {String} Slot name, default to 'default'.
 * @param fallback {?Element[]} Fallback slot element.
 * @param props {?Object} Scoped slot property.
 * @param bindObject {?Object} Only works in SFC, with bind of properties.
 */
export default function renderSlot(viewModel, slotName = 'default', fallback, props, bindObject) {
  const scopedSlotFn = viewModel[SCOPED_SLOT_KEY][slotName];
  let slotNodes;
  if (scopedSlotFn) { // scoped slot
    props = props || {};
    if (bindObject) {
      props = { ...bindObject, ...props };
    }
    slotNodes = scopedSlotFn(props) || fallback;
  } else {
    slotNodes = viewModel[SLOT_KEY][slotName] || fallback;
  }
  return slotNodes;
}
