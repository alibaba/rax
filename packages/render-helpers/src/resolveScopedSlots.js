/**
 * Runtime helper for resolving scoped slots.
 * @param fns {Object[]|Object} Descriptors of scoped slots.
 * @param res {?Object} Iterator result.
 * @return {Object}
 */
export default function resolveScopedSlots(fns, res) {
  res = res || {};
  for (let i = 0; i < fns.length; i++) {
    const slot = fns[i];
    if (Array.isArray(slot)) {
      resolveScopedSlots(slot, res);
    } else {
      res[slot.key] = slot.fn;
    }
  }
  return res;
}
