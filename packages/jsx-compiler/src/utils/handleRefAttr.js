const t = require('@babel/types');
const isNativeComponent = require('./isNativeComponent');
const generateId = require('./generateId');
const createBinding = require('./createBinding');

/**
 * @param {NodePath} attrPath - ref attribute path
 * @param {Node} childExpression - attr value's child expression
 * @param {Node} refName - ref name
 * @param {object} adapter - adapter
 * @param {Node} loopIndex - list index
 * @return {object} refInfo - ref information
 */
module.exports = function(attrPath, childExpression, refName, adapter, loopIndex) {
  const { node } = attrPath;
  const refInfo = {
    name: refName,
    method: childExpression
  };
  const attributes = attrPath.parent.attributes;
  const componentNameNode = attrPath.parent.name;
  const isNative = isNativeComponent(attrPath, adapter.platform);
  if (t.isJSXIdentifier(componentNameNode)) {
    if (componentNameNode.isCustom && !isNative) {
      refInfo.type = t.stringLiteral('component');
      insertBindComRef(
        attributes,
        childExpression,
        node.value,
        adapter.triggerRef
      );
    } else {
      refInfo.type = t.stringLiteral('native');
    }
  } else {
    refInfo.type = t.stringLiteral('component');
    insertBindComRef(
      attributes,
      childExpression,
      node.value,
      adapter.triggerRef
    );
  }
  // Get all attributes
  let idAttr = attributes.find(attr =>
    t.isJSXIdentifier(attr.name, { name: 'id' })
  );
  refInfo.id = idAttr && idAttr.value;
  if (!idAttr) {
    // Insert progressive increase id
    const id = generateId();
    if (loopIndex) {
      // id="id_0{{index}}"
      idAttr = t.jsxAttribute(
        t.jsxIdentifier('id'),
        t.stringLiteral(id + createBinding(loopIndex.name))
      );
      // id: "id_0" + index
      refInfo.id = t.binaryExpression('+', t.stringLiteral(id), loopIndex);
    } else {
      idAttr = t.jsxAttribute(
        t.jsxIdentifier('id'),
        t.stringLiteral(id)
      );
      refInfo.id = idAttr.value;
    }
    attributes.push(idAttr);
    if (!isNative && adapter.styleKeyword) {
      // Clone componentId
      const componentIdAttr = t.jsxAttribute(t.jsxIdentifier('componentId'), idAttr.value);
      attributes.push(componentIdAttr);
    }
  }

  node.__transformed = true;
  return refInfo;
};

function insertBindComRef(attributes, childExpression, ref, triggerRef) {
  // Inset setCompRef
  // <Child bindComRef={fn} /> in MiniApp
  // <Child bindComRef="scrollRef" /> in WechatMiniProgram
  attributes.push(
    t.jsxAttribute(
      t.jsxIdentifier('bindComRef'),
      triggerRef ? ref : t.jsxExpressionContainer(childExpression)
    )
  );
}
