const SLOT_KEY = '$slots';

/**
 * Render slots.
 * @param viewModel {Object} ViewModel that contains slots.
 * @param slotName {String} Slot name, default to 'default'.
 */
export default function renderSlot(viewModel, slotName = 'default') {
  return (viewModel && SLOT_KEY in viewModel)
    ? viewModel[SLOT_KEY][slotName]
    : null;
}
