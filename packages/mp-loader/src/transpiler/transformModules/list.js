const { getAndRemoveAttr, addAttr } = require('../helpers');

const forAliasRE = /(.*?)\s+(?:in|of)\s+(.*)/;
const forIteratorRE = /\((\{[^}]*\}|[^,]*),([^,]*)(?:,([^,]*))?\)/;
const { getAdapter } = require('../adapter');

const adapter = getAdapter();

function transformNode(el) {
  if (el.type !== 1) return;
  const { FOR_ATTRIBUTES } = adapter;
  let forKey = getAndRemoveAttr(el, FOR_ATTRIBUTES.FOR);
  if (forKey) {
    const forItem = getAndRemoveAttr(el, FOR_ATTRIBUTES.FOR_ITEM) || 'item';
    const forIdx = getAndRemoveAttr(el, FOR_ATTRIBUTES.FOR_IDX) || 'index';
    let exp = `(${forItem},${forIdx}) in ${forKey}`;
    const inMatch = exp.match(forAliasRE);
    if (!inMatch) {
      process.env.NODE_ENV !== 'production' &&
        console.error(`Invalid v-for expression: ${exp}`);
      return;
    }
    el.for = inMatch[2].trim();
    const alias = inMatch[1].trim();
    const iteratorMatch = alias.match(forIteratorRE);
    if (iteratorMatch) {
      el.alias = iteratorMatch[1].trim();
      el.iterator1 = iteratorMatch[2].trim();
      if (iteratorMatch[3]) {
        el.iterator2 = iteratorMatch[3].trim();
      }
    } else {
      el.alias = alias;
    }
  }
};

module.exports = {
  transformNode
};
