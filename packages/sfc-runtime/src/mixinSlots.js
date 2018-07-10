// null, default or slotName
function getSlotName(item) {
  if (item && Object.hasOwnProperty.call(item, 'props')) {
    return item.props.slot || 'default';
  } else {
    return 'default';
  }
}

function deleteSlot(item) {
  if (item && Object.hasOwnProperty.call(item, 'props')) {
    delete item.props.slot;
  }
}

export default function mixinSlots(vm, children) {
  const $slots = {};
  function injectSlot(child) {
    const slotName = getSlotName(child);
    if (null === slotName) {
      return;
    }
    $slots[slotName] = $slots[slotName] || [];
    $slots[slotName].push(child);
    // remove slot attr to avoid disappear
    deleteSlot(child);
  }
  if (Array.isArray(children)) {
    for (let i = 0, l = children.length; i < l; i++) {
      injectSlot(children[i]);
    }
  } else {
    injectSlot(children);
  }

  Object.defineProperty(vm, '$slots', {
    enumerable: false,
    configurable: true,
    get: function() {
      return $slots;
    }
  });
}
