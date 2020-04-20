const t = require('@babel/types');
const traverse = require('../utils/traverseNodePath');
const genExpression = require('../codegen/genExpression');
const createBinding = require('../utils/createBinding');
const { BINDING_REG } = require('../utils/checkAttr');

function transformRaxSlider(ast, adapter) {
  traverse(ast, {
    JSXOpeningElement(path) {
      if (path.get('name').isJSXIdentifier({ name: 'rax-slider' })) {
        const children = path.parent.children.filter(
          (child) => {
            if (child.openingElement && t.isJSXIdentifier(child.openingElement.name)) {
              const componentName = child.openingElement.name.name;
              // For <swiper-item a:for="{{list}}"/> or <block a:for="{{list}}" />
              return componentName === 'swiper-item' || componentName === 'block';
            }
            return false;
          }
        );
        let swiperItemLength = 0;
        const childList = [];
        children.forEach((child, index) => {
          const childOpeningElement = child.openingElement;
          const childAttributes = childOpeningElement.attributes;
          // Get a:for attribute
          const forAttriute = childAttributes.find(
            (attr) => genExpression(attr.name) === adapter.for
          );
          if (forAttriute) {
            const forIndex = childAttributes.find((attr) => genExpression(attr.name) === adapter.forIndex);
            insertSlotName(
              child,
              // 1 + arr1.length + index
              index - childList.length + getChildListLengthExpression(childList) + '+' + forIndex.value.value
            );
            childList.push(
              forAttriute.value.value.replace(BINDING_REG, '') + '.length'
            );
          } else {
            insertSlotName(
              child,
              index - childList.length + getChildListLengthExpression(childList)
            );
            swiperItemLength++;
          }
        });
        if (swiperItemLength > 0 || childList.length > 0) {
          path.node.attributes.push(
            t.jsxAttribute(
              t.jsxIdentifier('__length'),
              t.stringLiteral(
                createBinding(
                  // {{ %swiperItemLength% + arr1.length + arr2.length }}
                  swiperItemLength + getChildListLengthExpression(childList)
                )
              )
            )
          );
        }
      }
    },
  });
}

// Return like arr1.length + arr2.length
function getChildListLengthExpression(childList) {
  return childList.reduce(
    (prevExpression, currentExpression) =>
      `${prevExpression}+${currentExpression}`,
    ''
  );
}

function insertSlotName(currentEl, name) {
  getSwiperItemAttributes(currentEl).push(
    t.jsxAttribute(
      t.jsxIdentifier('slot'),
      t.stringLiteral('slider-item-' + createBinding(name))
    )
  );
}

function getSwiperItemAttributes(currentEl) {
  const currentElOpeningElement = currentEl.openingElement;
  // <swiper-item a:for={{list}} />
  if (currentElOpeningElement.name.name === 'swiper-item') {
    return currentElOpeningElement.attributes;
  }
  // <block a:for={{list}}><swiper-item/></block>
  return currentEl.children[0].openingElement.attributes;
}

module.exports = {
  parse(parsed, code, options) {
    if (options.adapter.processSlider) {
      transformRaxSlider(parsed.templateAST, options.adapter);
    }
  },

  // For test cases.
  _transformRaxSlider: transformRaxSlider,
};
