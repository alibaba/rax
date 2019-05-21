const TAG_NAME_MAP = {
  block: 'template'
};

function transformNode(el) {
  if (el.type === 1) {
    el.tag = TAG_NAME_MAP[el.tag] || el.tag;
  }
};

module.exports = {
  transformNode
};
