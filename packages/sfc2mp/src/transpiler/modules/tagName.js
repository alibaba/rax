const tagNameMapping = {
  div: 'view',
  span: 'text',
  img: 'image',
  template: 'block',
};

function transformNode(el, state) {
  el.tag = tagNameMapping[el.tag] || el.tag;
}

module.exports = {
  transformNode,
};
