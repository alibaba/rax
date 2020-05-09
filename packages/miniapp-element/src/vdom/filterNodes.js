import { propsMap, componentNameMap } from '../component';
import {
  NOT_SUPPORT,
  NEET_SPLIT_CLASS_STYLE_FROM_CUSTOM_ELEMENT,
  NEET_BEHAVIOR_NORMAL_CUSTOM_ELEMENT,
  NEET_RENDER_TO_CUSTOM_ELEMENT,
  USE_TEMPLATE,
  NEET_BEHAVIOR_NORMAL_CUSTOM_ELEMENT_PARENT,
} from '../constants';
import checkComponentAttr from './checkComponentAttr';

// Filter nodes only reserve childs
export default function filterNodes(domNode, level, component) {
  const childNodes = domNode.childNodes || [];

  if (!childNodes.map) return [];
  // Tags are not supported and child nodes are not rendered
  if (NOT_SUPPORT.indexOf(domNode.tagName) >= 0) return [];

  return childNodes
    .map((child) => {
      const domInfo = child.$$domInfo;

      if (domInfo.type !== 'element' && domInfo.type !== 'text') return;

      // Add default class
      domInfo.className =
        domInfo.type === 'element'
          ? `h5-${domInfo.tagName} node-${domInfo.nodeId} ${
            domInfo.className || ''
          }`
          : '';
      domInfo.domNode = child;

      // Special node
      if (
        NEET_SPLIT_CLASS_STYLE_FROM_CUSTOM_ELEMENT.indexOf(child.tagName) >= 0
      ) {
        if (
          domInfo.tagName === 'builtin-component' &&
          NEET_BEHAVIOR_NORMAL_CUSTOM_ELEMENT.indexOf(child.behavior) !== -1
        ) {
          domInfo.compName = child.behavior;
          domInfo.extra = {
            hidden: child.getAttribute('hidden') || false,
          };

          // Add special component props
          const props = propsMap[child.behavior] || {};
          if (props && props.length) {
            props.forEach(({ name, get }) => {
              domInfo.extra[name] = get(child);
            });
          }

          if (child.children.length && level > 0) {
            domInfo.childNodes = filterNodes(child, level - 1, component);
          }
          return domInfo;
        }

        // id and style are excluded
        domInfo.className = `h5-${domInfo.tagName} ${
          domInfo.tagName === 'builtin-component'
            ? 'builtin-' + child.behavior
            : ''
        }`;
        domInfo.id = '';
        domInfo.style = '';
      }

      // Check image node
      domInfo.isImage = domInfo.type === 'element' && domInfo.tagName === 'img';
      if (domInfo.isImage) {
        domInfo.src = child.src || '';
        domInfo.mode = child.getAttribute('mode') || '';
        domInfo.lazyLoad = !!child.getAttribute('lazy-load');
        domInfo.showMenuByLongpress = !!child.getAttribute(
          'show-menu-by-longpress'
        );
      } else {
        domInfo.src = '';
        domInfo.mode = '';
        domInfo.lazyLoad = false;
        domInfo.showMenuByLongpress = false;
      }

      // Check wheather use template
      const templateName =
        domInfo.tagName === 'builtin-component'
          ? child.behavior
          : child.tagName;
      domInfo.useTemplate =
        !domInfo.isImage && USE_TEMPLATE.indexOf(templateName) !== -1;
      if (domInfo.useTemplate) {
        const compName = componentNameMap[templateName.toLowerCase()];
        const extra = {};
        if (compName)
          checkComponentAttr(
            domInfo,
            compName,
            extra,
            `h5-${domInfo.tagName} ${
              domInfo.tagName === 'builtin-component'
                ? 'builtin-' + child.behavior
                : ''
            }`
          );
        extra.pageId = domInfo.pageId;
        extra.nodeId = domInfo.nodeId;
        extra.inCover = component.data.inCover;
        extra.hasChildren = !!child.childNodes.length;
        domInfo.extra = extra;

        if (
          NEET_BEHAVIOR_NORMAL_CUSTOM_ELEMENT_PARENT.indexOf(templateName) !==
          -1
        ) {
          const childNodes = filterNodes(child, 0, component) || [];
          extra.childNodes = childNodes.map((childNode) => {
            const copyChildNode = Object.assign({}, childNode);
            delete copyChildNode.domNode;
            return copyChildNode;
          });
        }
      }

      // Check child nodes
      domInfo.isLeaf =
        !domInfo.isImage &&
        domInfo.type === 'element' &&
        !child.children.length &&
        NEET_RENDER_TO_CUSTOM_ELEMENT.indexOf(child.tagName.toUpperCase()) ===
          -1;
      if (domInfo.isLeaf) {
        domInfo.content = child.childNodes
          .map((childNode) =>
            childNode.$$domInfo.type === 'text' ? childNode.textContent : ''
          )
          .join('');
      }

      // Check simple node that can be rendered as view
      domInfo.isSimple =
        !domInfo.isImage &&
        !domInfo.useTemplate &&
        !domInfo.isLeaf &&
        domInfo.type === 'element' &&
        NEET_RENDER_TO_CUSTOM_ELEMENT.indexOf(child.tagName) === -1 &&
        level > 0;
      if (domInfo.isSimple) {
        domInfo.content = '';
        domInfo.childNodes = filterNodes(child, level - 1, component);
      }

      return domInfo;
    })
    .filter((child) => !!child);
}
