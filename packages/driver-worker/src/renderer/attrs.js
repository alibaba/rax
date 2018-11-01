const INVALID_ATTRS_MAP = {
  /**
   * In web components, slot attribute has side effects to
   * deliver child nodes.
   */
  slot: true,
};

export function isInvalidAttr(attr) {
  return INVALID_ATTRS_MAP.hasOwnProperty(attr);
}
