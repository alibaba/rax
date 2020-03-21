import render from 'miniapp-render';
import { propsMap } from '../component';
import {
  NOT_SUPPORT, NEET_SPLIT_CLASS_STYLE_FROM_CUSTOM_ELEMENT,
  NEET_BEHAVIOR_NORMAL_CUSTOM_ELEMENT, NEET_RENDER_TO_CUSTOM_ELEMENT
} from '../constants';

const { cache, tool } = render.$$adapter;

// Filter nodes only reserve childs
export default function filterNodes(domNode, level) {
  const childNodes = domNode.childNodes || [];

  if (!childNodes.map) return [];
  // Tags are not supported and child nodes are not rendered
  if (NOT_SUPPORT.indexOf(domNode.tagName) >= 0) return [];

  return childNodes.map(child => {
    const domInfo = child.$$domInfo;

    if (domInfo.type !== 'element' && domInfo.type !== 'text') return;

    // Add default class
    domInfo.class = `h5-${domInfo.tagName} node-${domInfo.nodeId} ${domInfo.class || ''}`;
    domInfo.domNode = child;

    // Special node
    if (NEET_SPLIT_CLASS_STYLE_FROM_CUSTOM_ELEMENT.indexOf(child.tagName) >= 0) {
      if (domInfo.tagName === 'builtin-component' && NEET_BEHAVIOR_NORMAL_CUSTOM_ELEMENT.indexOf(child.behavior) !== -1) {
        domInfo.compName = child.behavior;
        domInfo.extra = {
          hidden: child.getAttribute('hidden') || false,
        };

        // Add special component props
        const props = propsMap[child.behavior] || {};
        if (props && props.length) {
          props.forEach(({name, get}) => {
            domInfo.extra[name] = get(child);
          });
        }

        if (child.children.length && level > 0) {
          domInfo.childNodes = filterNodes(child, level - 1);
        }
        return domInfo;
      }

      // id and style are excluded
      domInfo.class = `h5-${domInfo.tagName} ${domInfo.tagName === 'builtin-component' ? 'builtin-' + child.behavior : ''}`;
      domInfo.id = '';
      domInfo.style = '';
    }

    // Check image node
    domInfo.isImage = domInfo.type === 'element' && domInfo.tagName === 'img';
    if (domInfo.isImage) {
      domInfo.src = child.src || '';
      domInfo.mode = child.getAttribute('mode') || '';
      domInfo.lazyLoad = !!child.getAttribute('lazy-load');
      domInfo.showMenuByLongpress = !!child.getAttribute('show-menu-by-longpress');
    } else {
      domInfo.src = '';
      domInfo.mode = '';
      domInfo.lazyLoad = false;
      domInfo.showMenuByLongpress = false;
    }

    // Check child nodes
    domInfo.isLeaf = !domInfo.isImage && domInfo.type === 'element' && !child.children.length && NEET_RENDER_TO_CUSTOM_ELEMENT.indexOf(child.tagName.toUpperCase()) === -1;
    if (domInfo.isLeaf) {
      domInfo.content = child.childNodes.map(childNode => childNode.$$domInfo.type === 'text' ? childNode.textContent : '').join('');
    }

    // Check simple node that can be rendered as view
    domInfo.isSimple = !domInfo.isLeaf && domInfo.type === 'element' && NEET_RENDER_TO_CUSTOM_ELEMENT.indexOf(child.tagName.toUpperCase()) === -1 && level > 0;
    if (domInfo.isSimple) {
      domInfo.content = '';
      domInfo.childNodes = filterNodes(child, level - 1);
    }

    return domInfo;
  }).filter(child => !!child);
}
